import prisma from "../lib/prisma";

// CREATE & UPDATE
export const createUser = async (data: {
  username: string;
  email: string;
  passwordHash: string;
  role: "admin" | "customer";
}) => {
  return await prisma.user.create({ data });
};

export const updateUser = async (
  id: number,
  data: { username?: string; email?: string },
) => {
  return await prisma.user.update({ where: { id }, data });
};
// DELETE
export const deleteUser = async (id: number) => {
  return await prisma.user.delete({ where: { id } });
};

// READ
export const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const getUserByUsername = async (username: string) => {
  return await prisma.user.findFirst({ where: { username } });
};

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({ where: { email } });
};

export const getCustomers = async () => {
  return await prisma.user.findMany({ where: { role: "customer" } });
};
