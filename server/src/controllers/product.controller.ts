import { Request, Response } from "express";
import * as ProductService from "../services/product.service";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getAllProducts();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("getAllProducts error:", error); // ← add this
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const categoryName = req.params.categoryName as string;
    const products = await ProductService.getProductsByCategory(categoryName);
    if (products.length === 0) {
      res.status(404).json({
        success: false,
        message: "No products found in this category",
      });
      return;
    }
    res.status(200).json({ success: true, data: { products } });
  } catch (error) {
    // console.log("GetProducst by Cat error : ", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      res.status(400).json({ success: false, message: "Slug is required" });
      return;
    }
    const product = await ProductService.getProductBySlug(slug as string);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
