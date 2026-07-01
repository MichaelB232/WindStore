import prisma from "../lib/prisma";

export const getAllBrands = async () => {
  return prisma.brand.findMany({
    select: { name: true, description: true, id: true },
  });
};
export const createBrand = async ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  return prisma.brand.create({ data: { name, description } });
};
export const updateBrand = async ({
  id,
  name,
  description,
}: {
  id: number;
  name: string;
  description: string;
}) => {
  return prisma.brand.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(description && { description }),
    },
  });
};
export const deleteBrand = async (id: number) => {
  return await prisma.brand.delete({ where: { id } });
};

export const getBrandByName = async (name: string) => {
  return await prisma.brand.findUnique({ where: { name } });
};

export const getBrandById = async (id: number) => {
  return await prisma.brand.findFirst({ where: { id } });
};
