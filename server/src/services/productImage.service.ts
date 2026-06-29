import prisma from "../lib/prisma";

export const addProductImage = async (
  productId: number,
  imageUrl: string,
  isPrimary: boolean = false,
) => {
  const count = await prisma.productImage.count({ where: { productId } });

  // If this is primary, unset other primary images first
  if (isPrimary) {
    await prisma.productImage.updateMany({
      where: { productId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  return await prisma.productImage.create({
    data: {
      productId,
      imageUrl,
      isPrimary,
      displayOrder: count + 1,
    },
  });
};

export const updateProductImage = async (
  id: number,
  isPrimary: boolean,
  productId: number,
) => {
  // If setting as primary, unset others first
  if (isPrimary) {
    await prisma.productImage.updateMany({
      where: { productId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  return await prisma.productImage.update({
    where: { id },
    data: { isPrimary },
  });
};

export const deleteProductImage = async (id: number) => {
  return await prisma.productImage.delete({ where: { id } });
};
