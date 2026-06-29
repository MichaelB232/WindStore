import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import * as ProductFeatureService from "../services/productFeature.service";

export const getFeaturesByProductId = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);
    const features =
      await ProductFeatureService.getFeaturesByProductId(productId);

    if (features.length === 0) {
      res.status(404).json({
        success: false,
        message: "No features found for this product",
      });
      return;
    }

    res.status(200).json({ success: true, data: features });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createProductFeature = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, title, description } = req.body;

    if (!productId || !title || !description) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    const feature = await ProductFeatureService.createProductFeature({
      productId: Number(productId),
      title,
      description,
    });

    res.status(201).json({ success: true, data: feature });
  } catch (error: any) {
    if (error.code === "P2003") {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    console.error("Create feature error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProductFeature = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, description } = req.body;

    if (!title || !description) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    const feature = await ProductFeatureService.updateProductFeature(id, {
      title,
      description,
    });

    res.status(200).json({ success: true, data: feature });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "Feature not found" });
      return;
    }
    console.error("Update feature error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteProductFeature = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await ProductFeatureService.deleteProductFeature(id);
    res
      .status(200)
      .json({ success: true, message: "Feature deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "Feature not found" });
      return;
    }
    console.error("Delete feature error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
