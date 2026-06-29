import { Router } from "express";
import * as ProductConfigController from "../controllers/productConfig.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middlewares";
const router = Router();

router.get("/:productId", ProductConfigController.showConfigsByProduct);

export default router;
