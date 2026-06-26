import { Router } from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import * as WishlistController from "../controllers/wishlist.controller";

const router = Router();

router.get("/", authenticate, WishlistController.getAllWishlistByUser);
router.post("/", authenticate, WishlistController.addProductToWishlist);

export default router;
