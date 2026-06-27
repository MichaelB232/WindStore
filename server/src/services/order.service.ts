import prisma from "../lib/prisma";
export const createOrder = async (
  userId: number,
  cartItems: { productId: number; configId: number; quantity: number }[],
) => {
  const configIds = cartItems.map((item) => Number(item.configId));

  const configs = await prisma.productConfig.findMany({
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
  return await prisma.$transaction(async (tx) => {
    const order = await prisma.order.create({
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

export const findOrderStatus = async (id: number, userId: number) => {
  return await prisma.order.findFirst({
    where: { id: id, userId: userId },
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
  return await prisma.order.findMany({
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
};
