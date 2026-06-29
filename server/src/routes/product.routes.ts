import { Router } from "express";
import * as ProductController from "../controllers/product.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middlewares";
const router = Router();

//Public
router.get("/", ProductController.getAllProducts);
router.get("/category/:categoryName", ProductController.getProductsByCategory);
router.get("/:slug", ProductController.getProductBySlug);

//admin only
router.post("/", authenticate, authorizeAdmin, ProductController.createProduct);
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  ProductController.updateProduct,
);
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  ProductController.deleteProduct,
);
export default router;
