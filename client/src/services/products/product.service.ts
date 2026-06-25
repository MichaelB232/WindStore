export async function getProduct() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch product data");

  const data = res.json;

  return data;
}
