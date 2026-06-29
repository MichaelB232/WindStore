import { Router } from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import * as OrderController from "../controllers/order.controller";

const router = Router();

router.get("/:orderId", authenticate, OrderController.getOrderStatus);
router.get("/", authenticate, OrderController.getMyOrders);
export default router;
