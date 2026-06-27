import { Router } from "express";
import { authorizeAdmin, authenticate } from "../middlewares/auth.middlewares";
import * as BrandController from "../controllers/brand.controller";

const router = Router();

router.get("/", BrandController.getAllBrands);
router.post("/", authenticate, authorizeAdmin, BrandController.createBrands);
router.put("/:id", authenticate, authorizeAdmin, BrandController.updateBrands);
export default router;
