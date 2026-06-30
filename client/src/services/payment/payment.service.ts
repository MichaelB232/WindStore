import {
  CheckoutPayload,
  CheckoutResult,
} from "@/src/lib/producttype/OrderType";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function createCheckout(
  cartItems: CheckoutPayload[],
): Promise<{ success: boolean; data?: CheckoutResult; message?: string }> {
  const res = await fetch(`${BASE}/api/payments/checkout`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartItems }),
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    return {
      success: false,
      message: json.message ?? "Failed to start checkout",
    };
  }

  return { success: true, data: json.data };
}

export async function getPaymentToken(publicId: string): Promise<{
  success: boolean;
  data?: { orderId: number; token: string; redirectUrl: string };
  message?: string;
}> {
  const res = await fetch(`${BASE}/api/payments/${publicId}/token`, {
    credentials: "include",
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    return {
      success: false,
      message: json.message ?? "Failed to get payment token",
    };
  }

  return { success: true, data: json.data };
}
