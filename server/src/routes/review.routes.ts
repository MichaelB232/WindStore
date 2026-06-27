import { Router } from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middlewares";
import * as ReviewController from "../controllers/review.controller";

const router = Router();

// Public
router.get("/:productId", ReviewController.getReviewsByProduct);

// Protected
router.post("/", authenticate, ReviewController.createReview);
router.put("/:id", authenticate, ReviewController.updateReview);
router.delete("/:id", authenticate, ReviewController.deleteReview);

export default router;
