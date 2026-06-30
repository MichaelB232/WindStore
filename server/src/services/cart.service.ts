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
  quantity?: number,
) => {
  const qty = quantity ?? 1;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true, name: true },
  });
  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }
  const existingCart = await prisma.cartItem.findFirst({
    where: { userId, productId, configId: productConfigId },
  });
  const totalQuantity = existingCart
    ? quantity !== undefined
      ? quantity
      : existingCart.quantity + 1
    : qty;

  if (totalQuantity > product.stock) {
    throw new Error("INSUFFICIENT STOCK");
  }
  // increment the qty
  if (existingCart) {
    return await prisma.cartItem.update({
      where: { id: existingCart.id },
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
