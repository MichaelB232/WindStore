export async function login(data: { username: string; password: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  return result;
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  return result;
}
