import prisma from "../lib/prisma";

export const getReviewsByProduct = async (productId: number) => {
  return await prisma.review.findMany({
    where: { productId },
    take: 5,
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: { select: { username: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getReviewsByProductSlug = async (slug: string) => {
  return await prisma.review.findMany({
    where: { product: { slug } },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: { select: { username: true } },
    },
  });
};

export const createReview = async (
  userId: number,
  productId: number,
  rating: number,
  comment?: string,
) => {
  return await prisma.review.create({
    data: { userId, productId, rating, comment },
  });
};

export const updateReview = async (
  id: number,
  userId: number,
  rating: number,
  comment?: string,
) => {
  return await prisma.review.update({
    where: { id, userId },
    data: { rating, comment },
  });
};

export const deleteReview = async (id: number, userId: number) => {
  return await prisma.review.delete({
    where: { id, userId }, // ← same here
  });
};

export const getUserReview = async (userId: number, productId: number) => {
  return await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });
};
