import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 1 * 30 * 1000,
  max: 100,
  message: { success: false, message: "Too many request" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter for auth
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many attempts, try again in 15 minutes",
  },
  keyGenerator: (req) => req.ip as string,
});

//Stricter for write operation (Create,Update,Delete)
export const writeLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 3,
  message: { success: false, message: "Please Slow down" },
  keyGenerator: (req: any) => req.user?.id?.toString() || req.ip,
});

//Strictest for payment
export const paymentLimiter = rateLimit({
  windowMs: 5000,
  max: 1,
  message: { success: false, message: "Please wait before trying again" },
  keyGenerator: (req: any) => req.user?.id?.toString() || req.ip,
});
