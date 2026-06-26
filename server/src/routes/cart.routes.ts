import { Router } from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import * as CartController from "../controllers/cart.controller";

const router = Router();

router.get("/", authenticate, CartController.getCartByUser);
router.post("/", authenticate, CartController.addToCart);
router.delete("/item", authenticate, CartController.removeFromCart);
router.delete("/", authenticate, CartController.clearCart);
export default router;
