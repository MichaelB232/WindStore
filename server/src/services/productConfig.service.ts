import prisma from "../lib/prisma";

export const getAllProductConfigs = async () => {
  return await prisma.productConfig.findMany();
};

export const getConfigsByProductId = async (productId: number) => {
  return await prisma.productConfig.findMany({
    where: { productId: productId },
  });
};

export const createProductConfig = async (data: {
  productId: number;
  configName: string;
  configType: string;
  priceModifier: bigint;
  isDefault: boolean;
}) => {
  const count = await prisma.productConfig.count({
    where: { productId: data.productId },
  });
  return await prisma.productConfig.create({
    data: { ...data, displayOrder: count + 1 },
  });
};
export const updateProductConfig = async (
  id: number,
  data: {
    productId: number;
    configName: string;
    configType: string;
    priceModifier: bigint;
    isDefault: boolean;
  },
) => {
  return await prisma.productConfig.update({
    where: { id },
    data: { ...data },
  });
};
export const deleteProductConfig = async (id: number) => {
  return await prisma.productConfig.delete({ where: { id } });
};
