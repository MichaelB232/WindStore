import prisma from "../lib/prisma";
export const createOrder = async (
  userId: number,
  cartItems: { productId: number; configId: number; quantity: number }[],
) => {
  return await prisma.$transaction(async (tx) => {
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
      if (!config)
        throw new Error(`Config with ID ${item.configId} is not found!`);
      if (item.quantity > config.product.stock) {
        throw new Error(`INSUFFICIENT_STOCK:${config.product.name}`);
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
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
    const order = await tx.order.create({
      data: {
        userId,
        totalPrice,
        status: "Pending",
        orderItems: { create: orderItemsData },
      },
      include: { orderItems: { include: { product: true } } },
    });
    return order;
  });
};

export const findOrderStatus = async (publicId: string, userId: number) => {
  return await prisma.order.findFirst({
    where: { publicId: publicId, userId: userId },
    include: {
      orderItems: {
        include: {
          product: { select: { name: true, imageUrl: true } },
          productConfig: { select: { configName: true } },
        },
      },
      payments: true,
    },
  });
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
  console.log(orders);
  return orders;
};

export const releaseExpiredOrders = async () => {
  const expiredOrders = await prisma.order.findMany({
    where: {
      status: "pending",
      createdAt: { lte: new Date(Date.now() - 30 * 60 * 1000) }, // 30 mins
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
