import { Router } from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import * as CartController from "../controllers/cart.controller";

const router = Router();

router.get("/", authenticate, CartController.getCartByUser);
router.post("/", authenticate, CartController.addToCart);

export default router;
