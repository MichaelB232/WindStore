
import prisma from "../lib/prisma";

export async function getAllCategories(): Promise<string[]> {
  const categories = await prisma.category.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });
  return categories.map((c) => c.name);
}
