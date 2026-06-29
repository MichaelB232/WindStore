import prisma from "../lib/prisma";

export const createProductFeature = async (data: {
  productId: number;
  title: string;
  description: string;
}) => {
  const count = await prisma.productFeature.count({
    where: { productId: data.productId },
  });

  return await prisma.productFeature.create({
    data: { ...data, displayOrder: count + 1 },
  });
};
export const updateProductFeature = async (
  id: number,
  data: { title: string; description: string },
) => {
  return await prisma.productFeature.update({
    where: { id },
    data: { ...data },
  });
};
export const deleteProductFeature = async (id: number) => {
  return await prisma.productFeature.delete({ where: { id } });
};
export const getAllProductFeatures = async () => {
  return await prisma.productFeature.findMany();
};
export const getFeaturesByProductId = async (productId: number) => {
  return await prisma.productFeature.findMany({ where: { productId } });
};
