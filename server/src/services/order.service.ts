import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { AppError } from "../errors/AppError";
import { snap } from "../lib/midtrans";

export const createOrder = async (
  userId: number,
  addressId: number,
  cartItems: { productId: number; configId: number; quantity: number }[],
) => {
  return await prisma.$transaction(async (tx) => {
    const address = await tx.address.findFirst({
      where: { id: Number(addressId), userId },
    });
    if (!address) {
      throw new AppError(
        404,
        "ADDRESS_NOT_FOUND",
        "Delivery address not found",
      );
    }

    // 1. Urutkan product ID unik untuk mencegah deadlock antar transaksi konkuren
    const uniqueProductIds = [
      ...new Set(cartItems.map((item) => Number(item.productId))),
    ].sort((a, b) => a - b);

    // 2. Pessimistic Row-Level Locking (SELECT ... FOR UPDATE)
    // Menjamin transaksi konkuren menunggu giliran dan selalu membaca stok ter-commit terbaru
    const lockedProducts = await tx.$queryRaw<
      Array<{ id: number; stock: number; name: string }>
    >`
      SELECT id, stock, name FROM "products"
      WHERE id IN (${Prisma.join(uniqueProductIds)})
      FOR UPDATE
    `;

    const lockedProductMap = new Map(lockedProducts.map((p) => [p.id, p]));

    // 3. Akumulasi total kuantitas per produk (mencegah bug jika ada beberapa config produk yang sama)
    const requiredQtyPerProduct = new Map<number, number>();
    for (const item of cartItems) {
      const pId = Number(item.productId);
      requiredQtyPerProduct.set(
        pId,
        (requiredQtyPerProduct.get(pId) || 0) + Number(item.quantity),
      );
    }

    // 4. Validasi stok berdasarkan data produk yang sudah dikunci
    for (const [pId, requestedQty] of requiredQtyPerProduct.entries()) {
      const product = lockedProductMap.get(pId);
      if (!product) {
        throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
      }
      if (requestedQty > product.stock) {
        throw new AppError(409, "INSUFFICIENT_STOCK", "Not Enough Stock", {
          productName: product.name,
          availableStock: product.stock,
          requestedQuantity: requestedQty,
        });
      }
    }

    // 5. Ambil data konfigurasi dan hitung total harga
    const configIds = cartItems.map((item) => Number(item.configId));
    const configs = await tx.productConfig.findMany({
      where: { id: { in: configIds } },
      include: { product: true },
    });

    const configMap = new Map(configs.map((c) => [c.id, c]));

    let totalPrice = BigInt(0);
    const orderItemsData: {
      productId: number;
      configId: number;
      quantity: number;
      unitPrice: bigint;
    }[] = [];

    for (const item of cartItems) {
      const config = configMap.get(Number(item.configId));
      if (!config) {
        throw new AppError(
          404,
          "CONFIG_NOT_FOUND",
          "Config is not found or no longer exists",
        );
      }

      const basePrice = BigInt(config.product.basePrice);
      const priceModifier = BigInt(config.priceModifier);
      const unitPrice = basePrice + priceModifier;

      const quantity = BigInt(item.quantity);
      totalPrice += unitPrice * quantity;

      orderItemsData.push({
        productId: Number(item.productId),
        configId: Number(item.configId),
        quantity: Number(item.quantity),
        unitPrice,
      });
    }

    // 6. Atomic decrement dengan kondisi stock >= qty sebagai lapis keamanan ganda
    for (const [pId, qty] of requiredQtyPerProduct.entries()) {
      const updateResult = await tx.product.updateMany({
        where: {
          id: pId,
          stock: { gte: qty },
        },
        data: {
          stock: { decrement: qty },
        },
      });

      if (updateResult.count === 0) {
        const product = lockedProductMap.get(pId);
        throw new AppError(409, "INSUFFICIENT_STOCK", "Not Enough Stock", {
          productName: product?.name,
        });
      }
    }

    // 7. Simpan pesanan
    const order = await tx.order.create({
      data: {
        userId,
        addressId: Number(addressId),
        totalPrice,
        status: "pending",
        orderItems: { create: orderItemsData },
      },
      include: { orderItems: { include: { product: true } } },
    });

    return order;
  });
};

export const findOrderStatus = async (publicId: string, userId: number) => {
  const order = await prisma.order.findFirst({
    where: { publicId: publicId, userId: userId },
    include: {
      orderItems: {
        include: {
          product: { select: { name: true, imageUrl: true } },
          productConfig: { select: { configName: true } },
        },
      },
      payments: true,
      address: true,
    },
  });

  if (!order) return null;

  if (order.status.toLowerCase() === "pending" && order.payments.length > 0) {
    const latestPayment = order.payments[order.payments.length - 1];
    if (latestPayment.transactionId) {
      try {
        const midtransStatus: any = await (snap as any).transaction.status(
          latestPayment.transactionId,
        );

        const trxStatus = midtransStatus?.transaction_status;
        const fraudStatus = midtransStatus?.fraud_status;

        if (trxStatus === "settlement" || trxStatus === "capture") {
          if (fraudStatus === "accept" || !fraudStatus) {
            await prisma.$transaction([
              prisma.order.update({
                where: { id: order.id },
                data: { status: "paid" },
              }),
              prisma.payment.updateMany({
                where: { orderId: order.id },
                data: { status: "success" },
              }),
            ]);
            order.status = "paid";
            latestPayment.status = "success";
          }
        } else if (
          trxStatus === "deny" ||
          trxStatus === "cancel" ||
          trxStatus === "expire"
        ) {
          await prisma.$transaction([
            prisma.order.update({
              where: { id: order.id },
              data: { status: "cancelled" },
            }),
            prisma.payment.updateMany({
              where: { orderId: order.id },
              data: { status: "failed" },
            }),
          ]);
          order.status = "cancelled";
          latestPayment.status = "failed";
        }
      } catch (err) {
      }
    }
  }

  return order;
};

export const getMyOrders = async (userId: number) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: { select: { name: true, imageUrl: true } },
          productConfig: { select: { configName: true } },
        },
      },
      payments: { select: { status: true, amount: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return orders;
};

export const releaseExpiredOrders = async () => {
  const expiredOrders = await prisma.order.findMany({
    where: {
      status: "pending",
      createdAt: { lte: new Date(Date.now() - 15 * 60 * 1000) },
    },
    include: { orderItems: true },
  });

  for (const order of expiredOrders) {
    await prisma.$transaction([
      ...order.orderItems.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        }),
      ),
      prisma.order.update({
        where: { id: order.id },
        data: { status: "cancelled" },
      }),
    ]);
  }
  return expiredOrders;
};
