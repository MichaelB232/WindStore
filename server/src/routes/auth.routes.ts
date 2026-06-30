import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middlewares";
import { authLimiter } from "../middlewares/rateLimiter";
const router = Router();

router.post("/login", authLimiter, AuthController.login);
router.post("/register", authLimiter, AuthController.register);
router.get("/me", authenticate, AuthController.me);
router.post("/logout", AuthController.logout);

export default router;
