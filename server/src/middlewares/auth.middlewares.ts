import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

// Extend Request type to include user
export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);
    req.user = decoded; // attach user info to request

    next(); // continue to controller
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Admin only middleware
export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ success: false, message: "Admin access only" });
    return;
  }
  next();
};
