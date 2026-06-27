import { Prisma } from "@prisma/client";
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
      category: { name: categoryName },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      basePrice: true,
      badge: true,
      imageUrl: true,
      stock: true,
      brand: { select: { name: true } },
      category: { select: { name: true } },
      productImages: { where: { isPrimary: true }, select: { imageUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getFilteredProducts = async (filters: {
  category?: string;
  brand?: string[];
  search?: string;
  processor?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: string;
}) => {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(filters.category && {
      category: { name: { equals: filters.category, mode: "insensitive" } },
    }),
    ...(filters.brand?.length && {
      brand: { name: { in: filters.brand, mode: "insensitive" } },
    }),
    ...(filters.search && {
      name: { contains: filters.search, mode: "insensitive" },
    }),
    ...((filters.priceMin !== undefined || filters.priceMax !== undefined) && {
      basePrice: {
        ...(filters.priceMin !== undefined && { gte: BigInt(filters.priceMin) }),
        ...(filters.priceMax !== undefined && { lte: BigInt(filters.priceMax) }),
      },
    }),
    ...(filters.processor?.length && {
      OR: filters.processor.map((proc) => ({
        specs: {
          path: ["processor"],
          string_contains: proc,
          mode: "insensitive" as const,
        },
      })),
    }),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sortBy === "price-asc"
      ? { basePrice: "asc" }
      : filters.sortBy === "price-desc"
        ? { basePrice: "desc" }
        : { createdAt: "desc" };

  return await prisma.product.findMany({
    where,
    include: {
      brand: { select: { name: true } },
      category: { select: { name: true } },
      productImages: { where: { isPrimary: true }, select: { imageUrl: true } },
    },
    orderBy,
  });
};

export const getUniqueProcessors = async () => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { specs: true },
  });

  const processors = products
    .map((p) => (p.specs as any)?.processor)
    .filter(Boolean);

  return [...new Set(processors)];
};

export const getProductBySlug = async (slug: string) => {
  return await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      brand: { select: { name: true } },
      productFeatures: { select: { title: true, description: true } },
      productImages: { select: { imageUrl: true } },
      productConfigs: {
        select: { id: true, configName: true, configType: true, priceModifier: true },
      },
    },
  });
};