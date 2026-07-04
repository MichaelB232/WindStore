import { Router } from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import * as UserController from "../controllers/user.controller";

const router = Router();
router.put("/me", authenticate, UserController.updateMe); // update own profile
router.delete("/deleteMe", authenticate, UserController.deleteMe); // delete own account
export default router;
