import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import * as CategoryService from "../services/category.service";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      res
        .status(400)
        .json({ success: false, message: "Category name is required" });
      return;
    }

    const category = await CategoryService.createCategory(name);
    res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    if (error.code === "P2002") {
      res
        .status(409)
        .json({ success: false, message: "Category already exists" });
      return;
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (!name) {
      res
        .status(400)
        .json({ success: false, message: "Category name is required" });
      return;
    }

    const category = await CategoryService.updateCategory(id, name);
    res.status(200).json({ success: true, data: category });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }
    if (error.code === "P2002") {
      res
        .status(409)
        .json({ success: false, message: "Category name already exists" });
      return;
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await CategoryService.deleteCategory(id);
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }
    if (error.code === "P2003") {
      res.status(409).json({
        success: false,
        message: "Cannot delete category that has products",
      });
      return;
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
