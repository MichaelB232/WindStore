import prisma from "../lib/prisma";

export const addWishlist = async (userId: number, productId: number) => {
  return await prisma.wishlist.create({
    data: { productId: productId, userId: userId },
  });
};

export const getWishlist = async (userId: number) => {
  return await prisma.wishlist.findFirst({
    where: { userId },
    include: { product: true },
  });
};
