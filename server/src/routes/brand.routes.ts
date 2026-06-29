import { Router } from "express";
import { authorizeAdmin, authenticate } from "../middlewares/auth.middlewares";
import * as BrandController from "../controllers/brand.controller";

const router = Router();

router.get("/", BrandController.getAllBrands);

export default router;
