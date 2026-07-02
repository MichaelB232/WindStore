export interface UpdateErrors {
  username: string;
  email: string;
  general: string;
}

export default function UpdateValidators(
  username: string,
  email: string,
): UpdateErrors {
  const errors: UpdateErrors = {
    username: "",
    email: "",
    general: "",
  };

  if (!username.trim()) {
    errors.username = "* Username wajib diisi";
  }

  if (!email.trim()) {
    errors.email = "* Email wajib diisi";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "* Format email tidak valid";
  }

  return errors;
}
