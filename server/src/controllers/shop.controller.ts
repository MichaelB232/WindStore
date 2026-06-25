import { Request, Response } from "express";
import * as ProductService from "../services/product.service";
import * as BrandService from "../services/brand.service";

export const getShop = async (req: Request, res: Response) => {
  try {
    const { category, brand, search, processor } = req.query;
    const brands = await BrandService.getAllBrands();
    const processors = await ProductService.getUniqueProcessors();
    const products = await ProductService.getFilteredProducts({
      category: category as string,
      brand: brand as string,
      search: search as string,
      processor: processor as string,
    });
    res
      .status(200)
      .json({ success: true, data: { brands, products, processors } });
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
