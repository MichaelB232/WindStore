import prisma from "../lib/prisma";

export const addWishlist = async (userId: number, productId: number) => {
  const existing = await prisma.wishlist.findFirst({
    where: { userId, productId },
  });
  if (existing) return existing;

  return await prisma.wishlist.create({
    data: { productId: productId, userId: userId },
  });
};

export const getWishlist = async (userId: number) => {
  return await prisma.wishlist.findMany({
    where: { userId },
    include: { product: true },
  });
};

export const removeWishlist = async (userId: number, productId: number) => {
  return await prisma.wishlist.deleteMany({ where: { userId, productId } });
};
