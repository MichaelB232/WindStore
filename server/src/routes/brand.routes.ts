import { Router } from "express";
import { authorizeAdmin, authenticate } from "../middlewares/auth.middlewares";
import * as BrandController from "../controllers/brand.controller";

const router = Router();

router.get("/", BrandController.getAllBrands);
//Admin
router.post(
  "/admin/",
  authenticate,
  authorizeAdmin,
  BrandController.createBrands,
);
router.put(
  "/admin/:id",
  authenticate,
  authorizeAdmin,
  BrandController.updateBrands,
);
export default router;
