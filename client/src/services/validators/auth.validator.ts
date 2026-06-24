export interface LoginErrors {
  email: string;
  password: string;
  general: string;
}

export interface RegisterErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: string;
  general: string;
}

export function validateLoginForm(
  email: string,
  password: string,
): LoginErrors {
  const errors: LoginErrors = {
    email: "",
    password: "",
    general: "",
  };

  if (!email.trim()) {
    errors.email = "Email wajib diisi";
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Format email tidak valid";
  }

  if (!password.trim()) {
    errors.password = "Password wajib diisi";
  }

  if (password && password.length < 8) {
    errors.password = "Panjang password minimal 8 karakter";
  }

  return errors;
}

export function validateRegisterForm(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  acceptedTerms: boolean,
): RegisterErrors {
  const errors: RegisterErrors = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
    general: "",
  };

  if (!name.trim()) {
    errors.name = "Nama wajib diisi";
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
