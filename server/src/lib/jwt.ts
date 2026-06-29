import jwt from "jsonwebtoken";

// Hapus deklarasi SECRET di luar fungsi ini

// Generate token after login
export const generateToken = (payload: {
  id: number;
  username: string;
  role: string;
}) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "Kritis: JWT_SECRET tidak terdefinisi di environment variable!",
    );
  }

  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

// Verify token from request
export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "Kritis: JWT_SECRET tidak terdefinisi di environment variable!",
    );
  }

  return jwt.verify(token, secret);
};
