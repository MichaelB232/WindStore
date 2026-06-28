import { Review } from "@/src/lib/producttype/ReviewType";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getReviewsByProduct(
  productId: number,
): Promise<Review[]> {
  const res = await fetch(`${BASE}/api/reviews/${productId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch reviews");
  const json = await res.json();
  return json.data ?? [];
}

export async function createReview(
  productId: number,
  rating: number,
  comment?: string,
): Promise<{ success: boolean; status: number; message?: string }> {
  const res = await fetch(`${BASE}/api/reviews`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, rating, comment }),
  });
  const json = await res.json().catch(() => ({}));
  return { success: res.ok, status: res.status, message: json.message };
}
