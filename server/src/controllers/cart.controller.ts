import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import * as CartService from "../services/cart.service";

export const getCartByUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const cart = await CartService.getCartByUser(userId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId, configId, quantity } = req.body;

    if (!productId) {
      res
        .status(400)
        .json({ success: false, message: "ProductId is required" });
      return;
    }

    const cart = await CartService.addProductToCart(
      userId,
      productId,
      configId,
      quantity,
    );
    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { cartItemId } = req.body;

    if (!cartItemId) {
      res
        .status(400)
        .json({ success: false, message: "cartItemId is required" });
      return;
    }

    await CartService.removeCart(userId, Number(cartItemId));
    res.status(200).json({ success: true, message: "Removed from cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    await CartService.clearCart(userId);
    res.status(200).json({ success: true, message: "Cart Cleared" });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
