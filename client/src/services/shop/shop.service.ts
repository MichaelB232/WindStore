export interface GetShopParams {
  category?: string;
  brand?: string[];
  processor?: string[];
  search?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: string;
}

export async function getAllProduct(params: GetShopParams = {}) {
  const query = new URLSearchParams();

  if (params.category) query.set("category", params.category);
  if (params.brand?.length) query.set("brand", params.brand.join(","));
  if (params.processor?.length) query.set("processor", params.processor.join(","));
  if (params.search) query.set("search", params.search);
  if (params.priceMin !== undefined) query.set("priceMin", String(params.priceMin));
  if (params.priceMax !== undefined) query.set("priceMax", String(params.priceMax));
  if (params.sortBy) query.set("sortBy", params.sortBy);

  const qs = query.toString();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/shop${qs ? `?${qs}` : ""}`,
    { cache: "no-store" },
  );

  if (!res.ok) throw new Error("Failed to fetch product data");
  return res.json();
}