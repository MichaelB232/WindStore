import { AppError } from "../errors/AppError";
import prisma from "../lib/prisma";

export const getMyAddresses = async (userId: number) => {
  return await prisma.address.findMany({ where: { userId } });
};
export const getAddressById = async (id: number, userId: number) => {
  return await prisma.address.findFirst({ where: { id, userId } });
};
export const createAddress = async (
  userId: number,
  data: {
    label: string;
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    postalCode: string;
    fullAddress: string;
    isDefault: boolean;
  },
) => {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
  const count = await prisma.address.count({ where: { userId } });
  if (count === 0) data.isDefault = true;

  return await prisma.address.create({ data: { userId, ...data } });
};

export const updateAddress = async (
  id: number,
  userId: number,
  data: {
    label: string;
    recipientName: string;
    phone?: string;
    province: string;
    city?: string;
    district?: string;
    postalCode?: string;
    fullAddress?: string;
    isDefault: boolean;
  },
) => {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
  return await prisma.address.updateMany({ where: { id, userId }, data });
};

export const deleteAddress = async (id: number, userId: number) => {
  const address = await prisma.address.findFirst({ where: { userId, id } });

  if (!address) {
    throw new AppError(404, "ADDRESS_NOT_FOUND", "Address is not found");
  }

  if (address.isDefault) {
    const nextAddress = await prisma.address.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    if (nextAddress) {
      await prisma.address.update({
        where: { id: nextAddress.id },
        data: { isDefault: true },
      });
    }
  }
};

export const setDefaultAddress = async (id: number, userId: number) => {
  await prisma.address.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false },
  });

  return await prisma.address.update({
    where: { id, userId },
    data: { isDefault: true },
  });
};
