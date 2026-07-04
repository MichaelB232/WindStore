import { Brands } from "@/src/lib/producttype/ProductType";

export async function getAllBrands(): Promise<Brands[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/brand`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}
