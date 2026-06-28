export interface LoginErrors {
  username: string;
  password: string;
  general: string;
}

export interface RegisterErrors {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: string;
  general: string;
}

export function validateLoginForm(
  username: string,
  password: string,
): LoginErrors {
  const errors: LoginErrors = {
    username: "",
    password: "",
    general: "",
  };

  if (!username.trim()) {
    errors.username = "Email wajib diisi";
  }

  if (!password.trim()) {
    errors.password = "Password wajib diisi";
  }

  if (password && password.length < 6) {
    errors.password = "Panjang password minimal 6 karakter";
  }

  return errors;
}

export function validateRegisterForm(
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  acceptedTerms: boolean,
): RegisterErrors {
  const errors: RegisterErrors = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
    general: "",
  };

  if (!username.trim()) {
    errors.username = "Username wajib diisi";
  }

  if (!email.trim()) {
    errors.email = "Email wajib diisi";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Format email tidak valid";
  }

  if (!password.trim()) {
    errors.password = "Password wajib diisi";
  } else if (password.length < 6) {
    errors.password = "Password minimal 6 karakter";
  }

  if (!confirmPassword.trim()) {
    errors.confirmPassword = "Konfirmasi password wajib diisi";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Password tidak sama";
  }

  if (!acceptedTerms) {
    errors.terms = "Anda harus menyetujui syarat dan ketentuan";
  }

  return errors;
}
