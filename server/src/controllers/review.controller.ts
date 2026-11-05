import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import { Request } from "express";
import prisma from "../lib/prisma";
import * as ReviewService from "../services/review.service";

export const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);
    const reviews = await ReviewService.getReviewsByProduct(productId);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getReviewsByProductSlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    if (!slug) {
      res.status(400).json({ success: false, message: "Slug is required" });
      return;
    }
    const reviews = await ReviewService.getReviewsByProductSlug(slug);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const checkCanReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const productId = Number(req.params.productId);

    if (!productId) {
      res.status(400).json({ success: false, message: "Invalid product ID" });
      return;
    }

    const hasPurchased = await ReviewService.hasUserPurchasedProduct(
      userId,
      productId,
    );
    const existing = await ReviewService.getUserReview(userId, productId);

    res.status(200).json({
      success: true,
      data: {
        canReview: hasPurchased && !existing,
        hasPurchased,
        hasReviewed: !!existing,
        review: existing,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      res
        .status(400)
        .json({ success: false, message: "ProductId and rating are required" });
      return;
    }

    if (rating < 1 || rating > 5) {
      res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
      return;
    }

    // Hanya pembeli terverifikasi yang boleh mereview
    const hasPurchased = await ReviewService.hasUserPurchasedProduct(
      userId,
      Number(productId),
    );
    if (!hasPurchased) {
      res.status(403).json({
        success: false,
        message: "Hanya pengguna yang telah membeli produk ini yang dapat memberikan ulasan",
      });
      return;
    }

    const existing = await ReviewService.getUserReview(
      userId,
      Number(productId),
    );
    if (existing) {
      res
        .status(409)
        .json({ success: false, message: "You already reviewed this product" });
      return;
    }

    const review = await ReviewService.createReview(
      userId,
      Number(productId),
      rating,
      comment,
    );
    res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    if (error.code === "P2003") {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    const { rating, comment } = req.body;

    if (!rating) {
      res.status(400).json({ success: false, message: "Rating is required" });
      return;
    }

    if (rating < 1 || rating > 5) {
      res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
      return;
    }

    const review = await ReviewService.updateReview(
      id,
      userId,
      rating,
      comment,
    );

    if (!review) {
      res
        .status(404)
        .json({ success: false, message: "Review not found or not yours" });
      return;
    }

    res.status(200).json({ success: true, data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    const isAdmin = req.user!.role === "admin";

    if (isAdmin) {
      await prisma.review.delete({ where: { id } });
    } else {
      const deleted = await ReviewService.deleteReview(id, userId);
      if (!deleted) {
        res
          .status(404)
          .json({ success: false, message: "Review not found or not yours" });
        return;
      }
    }

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
