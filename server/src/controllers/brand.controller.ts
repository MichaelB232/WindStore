import { Request, Response } from "express";
import { authorizeAdmin } from "../middlewares/auth.middlewares";
import { AuthRequest } from "../middlewares/auth.middlewares";
import * as BrandService from "../services/brand.service";

export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const brands = await BrandService.getAllBrands();
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createBrands = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res
        .status(400)
        .json({ success: false, message: "Brand name must be filled" });
      return;
    }
    if (!description) {
      res
        .status(400)
        .json({ success: false, message: "Brand description must be filled" });
      return;
    }
    await BrandService.createBrand({ name: name, description: description });
    res.status(201).json({ success: true, message: "Successfuly add brand" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateBrands = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: "Id brand is required" });
      return;
    }
    if (!name) {
      res
        .status(400)
        .json({ success: false, message: "Brand name must be filled" });
      return;
    }
    if (!description) {
      res
        .status(400)
        .json({ success: false, message: "Brand description must be filled" });
      return;
    }
    await BrandService.updateBrand({
      id: Number(id),
      name: name,
      description: description,
    });
    res
      .status(200)
      .json({ success: true, message: "Successfuly update brand" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
