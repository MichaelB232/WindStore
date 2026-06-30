import { Router } from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middlewares";
import * as ReviewController from "../controllers/review.controller";
import { writeLimiter } from "../middlewares/rateLimiter";
const router = Router();

// Public
router.get("/:productId", ReviewController.getReviewsByProduct);

// Protected
router.post("/", authenticate, writeLimiter, ReviewController.createReview);
router.put("/:id", authenticate, writeLimiter, ReviewController.updateReview);
router.delete(
  "/:id",
  authenticate,
  writeLimiter,
  ReviewController.deleteReview,
);

export default router;
