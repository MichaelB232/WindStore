import { Order } from "@/src/lib/order/OrderType";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getOrderStatus(publicId: string): Promise<Order | null> {
  try {
    const res = await fetch(`${BASE}/api/orders/${publicId}`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data ?? null;
  } catch (error) {
    console.warn("Failed to fetch order status (server offline or network error):", error);
    return null;
  }
}

export async function getAllMyOrder(): Promise<Order[]> {
  try {
    const res = await fetch(`${BASE}/api/orders/`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return [];

    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.warn("Failed to fetch all orders:", error);
    return [];
  }
}
