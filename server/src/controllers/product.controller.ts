import { Request, Response } from "express";
import * as ProductService from "../services/product.service";
import { uploadImage } from "../services/upload.service";
import { AuthRequest } from "../middlewares/auth.middlewares";

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

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      brandId,
      slug,
      categoryId,
      motto,
      description,
      basePrice,
      badge,
      specs,
      stock,
      isActive,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !brandId ||
      !slug ||
      !categoryId ||
      !motto ||
      !description ||
      !basePrice ||
      !badge ||
      !specs
    ) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    // Upload image if provided
    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const product = await ProductService.createProduct({
      name,
      brandId: Number(brandId),
      slug,
      categoryId: Number(categoryId),
      motto,
      description,
      basePrice: BigInt(basePrice),
      badge,
      specs: typeof specs === "string" ? JSON.parse(specs) : specs,
      imageUrl,
      stock: Number(stock) ?? 0,
      isActive: isActive === "true" || isActive === true, // handle both string and boolean
    });

    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({ success: false, message: "Slug already exists" });
      return;
    }
    if (error.code === "P2003") {
      res
        .status(404)
        .json({ success: false, message: "Brand or Category not found" });
      return;
    }
    console.error("Create product error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const {
      name,
      brandId,
      slug,
      categoryId,
      motto,
      description,
      basePrice,
      badge,
      specs,
      stock,
      isActive,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !brandId ||
      !slug ||
      !categoryId ||
      !motto ||
      !description ||
      !basePrice ||
      !badge ||
      !specs
    ) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }
    let imageUrl: string | undefined = undefined;
    if (req.file) {
      imageUrl = await uploadImage(req.file);
    }

    const product = await ProductService.updateProduct(id, {
      name,
      brandId: Number(brandId),
      slug,
      categoryId: Number(categoryId),
      motto,
      description,
      basePrice: BigInt(basePrice),
      badge,
      specs: typeof specs === "string" ? JSON.parse(specs) : specs,
      ...(imageUrl && { imageUrl }),
      stock: Number(stock) ?? 0,
      isActive: isActive === "true" || isActive === true, // handle both string and boolean
    });
    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({ success: false, message: "Slug already exists" });
      return;
    }
    if (error.code === "P2003") {
      res
        .status(404)
        .json({ success: false, message: "Brand or Category not found" });
      return;
    }
    console.error("Create product error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, message: "Id is required" });
      return;
    }
    await ProductService.deleteProduct(id);
    res
      .status(200)
      .json({ success: true, message: "Successfuly delete product" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getAllProductsAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const products = await ProductService.getAllProductsAdmin(); // all products
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
