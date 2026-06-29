import { Router } from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import * as PaymentController from "../controllers/payment.controller";

const router = Router();

router.post("/webhook", PaymentController.webhook);
router.post("/checkout", authenticate, PaymentController.checkout);
router.get("/:orderId/token", authenticate, PaymentController.getPaymentToken);

export default router;
