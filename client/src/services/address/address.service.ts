import { Address, AddressPayload } from "@/src/lib/user/AddressType";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getMyAddresses(): Promise<Address[]> {
  const res = await fetch(`${BASE}/api/addresses`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export async function getAddressById(id: number): Promise<Address | null> {
  const res = await fetch(`${BASE}/api/addresses/${id}`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

export async function createAddress(
  data: AddressPayload,
): Promise<{ success: boolean; data?: Address; message?: string }> {
  const res = await fetch(`${BASE}/api/addresses`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    return {
      success: false,
      message: json.message ?? "Failed to create address",
    };
  }

  return { success: true, data: json.data };
}

export async function updateAddress(
  id: number,
  data: Partial<AddressPayload>,
): Promise<{ success: boolean; data?: Address; message?: string }> {
  const res = await fetch(`${BASE}/api/addresses/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    return {
      success: false,
      message: json.message ?? "Failed to update address",
    };
  }

  return { success: true, data: json.data };
}

export async function setDefaultAddress(
  id: number,
): Promise<{ success: boolean; data?: Address; message?: string }> {
  const res = await fetch(`${BASE}/api/addresses/${id}/default`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    return {
      success: false,
      message: json.message ?? "Failed to set default address",
    };
  }

  return { success: true, data: json.data };
}

export async function deleteAddress(
  id: number,
): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${BASE}/api/addresses/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    return {
      success: false,
      message: json.message ?? "Failed to delete address",
    };
  }

  return { success: true, message: json.message };
}
