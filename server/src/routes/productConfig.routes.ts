import { Router } from "express";
import * as ProductConfigController from "../controllers/productConfig.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middlewares";
const router = Router();

router.get(
  "/",
  authenticate,
  authorizeAdmin,
  ProductConfigController.showAllConfigs,
);
router.get("/:productId", ProductConfigController.showConfigsByProduct);
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  ProductConfigController.createProductConfig,
);
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  ProductConfigController.updateProductConfig,
);
router.delete(
  "/:id",
  authenticate,
  authorizeAdmin,
  ProductConfigController.deleteProductConfigs,
);

export default router;
