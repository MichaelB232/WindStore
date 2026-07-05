export async function getProduct() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch product data");
  return res.json();
}

export async function getProductBySlug(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  const json = await res.json();
  const data = json.data ?? null;
  if (!data) return null;

  return {
    ...data,
    defaultConfig: data.productConfigs?.[0] ?? null,
  };
}

export async function getProductBySearch(query: string, signal?: AbortSignal) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/search?q=${encodeURIComponent(query)}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error("Failed fetch to data");
  }

  const json = await response.json();

  return Array.isArray(json) ? json : (json.data ?? []);
}
