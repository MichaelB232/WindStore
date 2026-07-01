import prisma from "../lib/prisma";
import crypto from "crypto";
import { snap } from "../lib/midtrans";
import { createOrder } from "./order.service";
export const createPayment = async (
  userId: number,
  cartItems: { productId: number; configId: number; quantity: number }[],
) => {
  const order = await createOrder(userId, cartItems);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: `ORDER-${order.id}-${Date.now()}`, //Must be Uniqueee
      gross_amount: Number(order.totalPrice),
    },
    customer_details: {
      first_name: user!.username,
      email: user!.email,
    },
    item_details: order.orderItems.map((item) => ({
      id: item.productId.toString(),
      name: item.product.name,
      price: Number(item.unitPrice),
      quantity: item.quantity,
    })),
  } as any);
  const paymentMethod = await prisma.paymentMethod.findFirst({
    where: { code: "MIDTRANS" },
  });

  if (!paymentMethod) throw new Error("Payment Method not yet registered");

  await prisma.payment.create({
    data: {
      orderId: order.id,
      paymentMethodId: paymentMethod!.id,
      amount: order.totalPrice,
      status: "pending",
      transactionId: transaction.token,
    },
  });
  return {
    orderId: order.id,
    token: transaction.token, // <- FE uses this to open payment popup
    redirectUrl: transaction.redirect_url, // or redirect here dude
  };
};

export const handleWebhook = async (notification: any) => {
  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
    fraud_status,
  } = notification;

  const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

  const stringToHash = `${order_id}${status_code}${gross_amount}${serverKey}`;
  const localSignature = crypto
    .createHash("sha512")
    .update(stringToHash)
    .digest("hex");

  if (localSignature !== signature_key) {
    throw new Error("Invalid signature key! Request is not LEGIT!.");
  }

  const orderId = parseInt(order_id.split("-")[1]);

  let orderStatus = "pending";
  let paymentStatus = "pending";

  if (transaction_status === "settlement" || transaction_status === "capture") {
    if (fraud_status === "accept" || !fraud_status) {
      orderStatus = "paid";
      paymentStatus = "success";
    }
  } else if (
    transaction_status === "deny" ||
    transaction_status === "cancel" ||
    transaction_status === "expire"
  ) {
    orderStatus = "cancelled";
    paymentStatus = "failed";

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (order) {
      await prisma.$transaction(
        order.orderItems.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } }, //give back
          }),
        ),
      );
    }
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status: orderStatus },
    }),
    prisma.payment.updateMany({
      where: { orderId },
      data: { status: paymentStatus },
    }),
  ]);

  return { orderId, orderStatus, paymentStatus };
};

// Add this new function — generates/refreshes a snap token for an EXISTING pending order
export const getPaymentToken = async (userId: number, publicId: string) => {
  const order = await prisma.order.findFirst({
    where: { publicId, userId },
    include: { orderItems: { include: { product: true } } },
  });

  if (!order) throw new Error("Order not found");
  if (order.status.toLowerCase() !== "pending") {
    throw new Error("This order is no longer pending payment");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  const transaction = await snap.createTransaction({
    transaction_details: {
      order_id: `ORDER-${order.id}-${Date.now()}`,
      gross_amount: Number(order.totalPrice),
    },
    customer_details: {
      first_name: user!.username,
      email: user!.email,
    },
    item_details: order.orderItems.map((item) => ({
      id: item.productId.toString(),
      name: item.product.name,
      price: Number(item.unitPrice),
      quantity: item.quantity,
    })),
  } as any);

  // Update the existing payment row instead of creating a duplicate
  await prisma.payment.updateMany({
    where: { orderId: order.id, status: "pending" },
    data: { transactionId: transaction.token },
  });

  return {
    orderId: order.id,
    token: transaction.token,
    redirectUrl: transaction.redirect_url,
  };
};
