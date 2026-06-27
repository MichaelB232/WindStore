import { WishlistItem } from "@/src/lib/producttype/ProductType";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getWishlist(): Promise<WishlistItem[]> {
  const res = await fetch(`${BASE}/api/wishlist`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export async function addToWishlist(
  productId: number,
): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE}/api/wishlist`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  return { success: res.ok };
}

export async function removeFromWishlist(
  productId: number,
): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE}/api/wishlist`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });
  return { success: res.ok };
}

export async function toggleWishlist(
  productId: number,
  isWishlisted: boolean,
): Promise<{ success: boolean; nowWishlisted: boolean }> {
  if (isWishlisted) {
    const res = await removeFromWishlist(productId);
    return { ...res, nowWishlisted: false };
  } else {
    const res = await addToWishlist(productId);
    return { ...res, nowWishlisted: true };
  }
}
