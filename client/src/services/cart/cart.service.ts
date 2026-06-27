import { CartItem } from "@/src/lib/producttype/ProductType";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getCart(): Promise<CartItem[]> {
  const res = await fetch(`${BASE}/api/cart`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export async function addToCart(
  productId: number,
  configId: number,
  quantity = 1
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${BASE}/api/cart`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, configId, quantity }),
  });
  const json = await res.json();
  if (!res.ok) return { success: false, message: json.message };
  return { success: true };
}

export async function removeCartItem(cartItemId: number): Promise<void> {
  await fetch(`${BASE}/api/cart/item`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartItemId }),
  });
}

export async function clearCart(): Promise<void> {
  await fetch(`${BASE}/api/cart`, {
    method: "DELETE",
    credentials: "include",
  });
}