import { Request, Response } from "express";
import * as ProductService from "../services/product.service";
import * as BrandService from "../services/brand.service";
import * as CategoryService from "../services/category.service";

export const getShop = async (req: Request, res: Response) => {
  try {
    const { category, brand, search, processor, priceMin, priceMax, sortBy } =
      req.query;

    const [brands, processors, categories] = await Promise.all([
      BrandService.getAllBrands(),
      ProductService.getUniqueProcessors(),
      CategoryService.getAllCategories(),
    ]);

    const products = await ProductService.getFilteredProducts({
      category: category as string,
      brand: brand ? (brand as string).split(",") : undefined,
      processor: processor ? (processor as string).split(",") : undefined,
      search: search as string,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      sortBy: sortBy as string,
    });

    res.status(200).json({
      success: true,
      data: { brands, products, processors, categories },
    });
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
