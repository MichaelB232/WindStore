import { Router } from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import * as OrderController from "../controllers/order.controller";

const router = Router();

router.get("/", authenticate, OrderController.getMyOrders);
router.get("/:publicId", authenticate, OrderController.getOrderStatus);
export default router;
