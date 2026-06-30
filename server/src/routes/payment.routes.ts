import { Router } from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import * as PaymentController from "../controllers/payment.controller";
import { paymentLimiter } from "../middlewares/rateLimiter";
const router = Router();

router.post("/webhook", PaymentController.webhook);
router.post(
  "/checkout",
  authenticate,
  paymentLimiter,
  PaymentController.checkout,
);
router.get("/:publicId/token", authenticate, PaymentController.getPaymentToken);

export default router;
