import prisma from "../lib/prisma";

export const getCartByUser = async (userId: number) => {
  return await prisma.cartItem.findMany({
    where: { userId: userId },
    include: { product: true, productConfig: true },
  });
};

export const addProductToCart = async (
  userId: number,
  productId: number,
  productConfigId: number,
  quantity?: number,
) => {
  const existingCart = await prisma.cartItem.findFirst({
    where: { userId, configId: productConfigId, productId: productId },
  });
  if (existingCart) {
    return await prisma.cartItem.update({
      where: { id: existingCart.id },
      data: { quantity: quantity !== undefined ? quantity : { increment: 1 } },
    });
  }
  return await prisma.cartItem.create({
    data: {
      userId: userId,
      productId: productId,
      configId: productConfigId,
      quantity: quantity !== undefined ? quantity : 1,
    },
  });
};

export const removeCart = async (userId: number, cartItemId: number) => {
  return await prisma.cartItem.delete({ where: { id: cartItemId, userId } });
};

export const clearCart = async (userId: number) => {
  return await prisma.cartItem.deleteMany({ where: { userId } });
};
