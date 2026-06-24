import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

// Generate token after login
export const generateToken = (payload: {
  id: number;
  username: string;
  role: string;
}) => {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" }); // expires in 7 days
};

// Verify token from request
export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};
