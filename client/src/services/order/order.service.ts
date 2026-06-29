import { Order } from "@/src/lib/producttype/OrderType";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getOrderStatus(
  orderId: number | string,
): Promise<Order | null> {
  const res = await fetch(`${BASE}/api/orders/${orderId}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json.data ?? null;
}

export async function getAllMyOrder(): Promise<Order[]> {
  const res = await fetch(`${BASE}/api/orders/`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) return [];

  const json = await res.json();
  return json.data ?? [];
}
