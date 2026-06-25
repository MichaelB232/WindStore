import { Router } from "express";
import * as ShopController from "../controllers/shop.controller";

const router = Router();

router.get("/", ShopController.getShop);

export default router;
