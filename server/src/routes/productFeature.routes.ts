import { Router } from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middlewares";
import * as ProductFeatureController from "../controllers/productFeature.controller";

const router = Router();

// Public
router.get("/:productId", ProductFeatureController.getFeaturesByProductId);

// Admin only
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  ProductFeatureController.createProductFeature,
);
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  ProductFeatureController.updateProductFeature,
);
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  ProductFeatureController.deleteProductFeature,
);

export default router;
