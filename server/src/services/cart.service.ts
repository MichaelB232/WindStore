import { AppError } from "../errors/AppError";
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
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }
  const existingCart = await prisma.cartItem.findFirst({
    where: { userId, productId, configId: productConfigId },
  });

  const nextQuantity = existingCart ? existingCart.quantity + qty : qty;

  if (nextQuantity > product.stock) {
    throw new AppError(400, "INSUFFICIENT_STOCK", "Not Enough Stock", {
      productName: product.name,
      availableStock: product.stock,
    });
  }

  // increment the qty
  if (existingCart) {
    return await prisma.cartItem.update({
      where: { id: existingCart.id },
      data: { quantity: { increment: qty } },
    });
  }

  return await prisma.cartItem.create({
    data: {
      userId,
      productId,
      configId: productConfigId,
      quantity: qty,
    },
  });
};

export const removeCart = async (userId: number, cartItemId: number) => {
  return await prisma.cartItem.delete({ where: { id: cartItemId, userId } });
};

export const clearCart = async (userId: number) => {
  return await prisma.cartItem.deleteMany({ where: { userId } });
};
