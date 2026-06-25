export async function getAllProduct() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shop`);
  if (!res.ok) throw new Error("Failed to fetch product data");

  return res.json();
}
