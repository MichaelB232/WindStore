import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import * as WishlistService from "../services/wishlist.service";

export const getAllWishlistByUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const wishlist = await WishlistService.getWishlist(userId);
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const addProductToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId } = req.body;
    if (!productId) {
      res
        .status(400)
        .json({ success: false, message: "ProductId is required" });
      return;
    }
    const wishlist = await WishlistService.addWishlist(userId, productId);
    res.status(201).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId } = req.body;
    if (!productId) {
      res
        .status(400)
        .json({ success: false, message: "ProductId is required" });
      return;
    }
    await WishlistService.removeWishlist(userId, Number(productId));
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Errorasda" });
  }
};
