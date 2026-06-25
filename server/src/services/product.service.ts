import prisma from "../lib/prisma";

export const getAllProducts = async () => {
  return await prisma.product.findMany({
    where: { isActive: true },
    include: {
      brand: { select: { name: true } },
      category: { select: { name: true } },
      productImages: { where: { isPrimary: true }, select: { imageUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getProductsByCategory = async (categoryName: string) => {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      category: {
        name: categoryName,
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      basePrice: true,
      badge: true,
      imageUrl: true,
      stock: true,
      brand: {
        select: { name: true },
      },
      category: {
        select: { name: true },
      },
      productImages: {
        where: { isPrimary: true },
        select: { imageUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getFilteredProducts = async (filters: {
  category?: string;
  brand?: string;
  search?: string;
}) => {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      ...(filters.category && {
        category: {
          name: { equals: filters.category, mode: "insensitive" },
        },
      }),
      ...(filters.brand && {
        brand: {
          name: { equals: filters.brand, mode: "insensitive" },
        },
      }),
      ...(filters.search && {
        name: { contains: filters.search, mode: "insensitive" },
      }),
    },
    include: {
      brand: { select: { name: true } },
      category: { select: { name: true } },
      productImages: {
        where: { isPrimary: true },
        select: { imageUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
