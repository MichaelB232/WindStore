import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import * as ProductImageService from "../services/productImage.service";
import { uploadImage } from "../services/upload.service";

export const addProductImage = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, isPrimary } = req.body;

    if (!productId) {
      res
        .status(400)
        .json({ success: false, message: "ProductId is required" });
      return;
    }

    if (!req.file) {
      res
        .status(400)
        .json({ success: false, message: "Image file is required" });
      return;
    }

    const imageUrl = await uploadImage(req.file);

    const image = await ProductImageService.addProductImage(
      Number(productId),
      imageUrl,
      isPrimary === "true" || isPrimary === true,
    );

    res.status(201).json({ success: true, data: image });
  } catch (error: any) {
    if (error.code === "P2003") {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    console.error("Add image error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProductImage = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { isPrimary, productId } = req.body;

    if (!productId) {
      res
        .status(400)
        .json({ success: false, message: "ProductId is required" });
      return;
    }

    const image = await ProductImageService.updateProductImage(
      id,
      isPrimary === "true" || isPrimary === true,
      Number(productId),
    );

    res.status(200).json({ success: true, data: image });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "Image not found" });
      return;
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteProductImage = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await ProductImageService.deleteProductImage(id);
    res
      .status(200)
      .json({ success: true, message: "Image deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "Image not found" });
      return;
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
