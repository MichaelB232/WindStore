import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 1 * 30 * 1000,
  max: 100,
  message: { success: false, message: "Too many request" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter for auth
export const authLimiter = rateLimit({
  windowMs: 0.1 * 60 * 1000,
  // windowsMs: 10 * 60 * 1000, // Production
  max: 5,
  message: {
    success: false,
    message: "Too many attempts, try again in 6 sec", // development
  },
  keyGenerator: (req) => ipKeyGenerator(req.ip as string),
});

//Stricter for write operation (Create,Update,Delete)
export const writeLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 3,
  message: { success: false, message: "Please Slow down" },
  keyGenerator: (req: any) =>
    req.user?.id?.toString() || ipKeyGenerator(req.ip as string),
});

//Strictest for payment
export const paymentLimiter = rateLimit({
  windowMs: 5000,
  max: 1,
  message: { success: false, message: "Please wait before trying again" },
  keyGenerator: (req: any) =>
    req.user?.id?.toString() || ipKeyGenerator(req.ip as string),
});
