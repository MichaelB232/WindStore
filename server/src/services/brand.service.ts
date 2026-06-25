import prisma from "../lib/prisma";

export const getAllBrands = async () => {
  return prisma.brand.findMany({
    select: { name: true, description: true, id: true },
  });
};
