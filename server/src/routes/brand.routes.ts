import { Router } from "express";
import { authorizeAdmin } from "../middlewares/auth.middlewares";
import * as BrandController from "../controllers/brand.controller";

const router = Router();

router.get("/", BrandController.getAllBrands);
router.post("/", authorizeAdmin, BrandController.createBrands);
router.put("/:id", authorizeAdmin, BrandController.updateBrands);
export default router;
