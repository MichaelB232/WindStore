import { AppError } from "../errors/AppError";
import prisma from "../lib/prisma";

// CREATE & UPDATE
export const createUser = async (data: {
  username: string;
  email: string;
  passwordHash: string;
  role: "customer";
}) => {
  return await prisma.user.create({ data });
};

export const updateUser = async (
  id: number,
  data: { username?: string; email?: string },
) => {
  return await prisma.user.update({ where: { id }, data });
};

// DELETE (Soft Delete for financial audit compliance)
export const deleteUser = async (id: number) => {
  const activeOrder = await prisma.order.findFirst({
    where: { userId: id, status: { in: ["pending", "processing", "shipped"] } },
  });

  if (activeOrder) {
    throw new AppError(
      409,
      "HAS_ACTIVE_ORDER",
      "Cannot delete account with active orders. Please wait until your orders are completed or cancelled first..",
    );
  }

  // Soft delete: Menonaktifkan akun user tanpa menghapus riwayat order/pembayaran (audit compliance)
  return await prisma.user.update({
    where: { id },
    data: { isActive: false },
  });
};

// READ
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getUserById = async (id: number) => {
  return await prisma.user.findFirst({ where: { id, isActive: true } });
};

export const getUserByUsername = async (username: string) => {
  return await prisma.user.findFirst({ where: { username, isActive: true } });
};

export const getUserByIdentifier = async (identifier: string) => {
  return await prisma.user.findFirst({
    where: {
      OR: [{ username: identifier }, { email: identifier }],
      isActive: true,
    },
  });
};

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({ where: { email, isActive: true } });
};

export const getCustomers = async () => {
  return await prisma.user.findMany({ where: { role: "customer", isActive: true } });
};
