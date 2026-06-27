import prisma from "../lib/prisma";

export const getCartByUser = async (userId: number) => {
  return await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          brand: { select: { name: true } },
        },
      },
      productConfig: true,
    },
  });
};

export const addProductToCart = async (
  userId: number,
  productId: number,
  productConfigId: number,
  quantity = 1,
) => {
  const existingItem = await prisma.cartItem.findFirst({
    where: { userId, productId, configId: productConfigId },
  });

  // increment the qty
  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: quantity } },
    });
  }

  return await prisma.cartItem.create({
    data: {
      userId,
      productId,
      configId: productConfigId,
      quantity,
    },
  });
};

export const removeCart = async (userId: number, cartItemId: number) => {
  return await prisma.cartItem.delete({ where: { id: cartItemId, userId } });
};

export const clearCart = async (userId: number) => {
  return await prisma.cartItem.deleteMany({ where: { userId } });
};