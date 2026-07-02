const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function updateProfile(data: { username: string; email: string }) {
  const response = await fetch(`${BASE}/api/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();

    return {
      success: false,
      message: error.message ?? "Failed to update account",
    };
  }

  const result = await response.json();
  return {
    success: true,
    message: "Account Update Successful",
    data: result,
  };
}
