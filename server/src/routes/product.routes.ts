import { Router } from "express";
import * as ProductController from "../controllers/product.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middlewares";
const router = Router();

router.get("/", ProductController.getAllProducts);
router.get("/:slug", ProductController.getProductBySlug);
router.get("/category/:categoryName", ProductController.getProductsByCategory);
export default router;
