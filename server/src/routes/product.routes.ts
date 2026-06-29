import { Router } from "express";
import * as ProductController from "../controllers/product.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middlewares";
const router = Router();

//Public
router.get("/", ProductController.getAllProducts);
router.get("/category/:categoryName", ProductController.getProductsByCategory);
router.get("/:slug", ProductController.getProductBySlug);

export default router;
