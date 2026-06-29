import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import * as ProductConfigService from "../services/productConfig.service";

export const showAllConfigs = async (req: AuthRequest, res: Response) => {
  try {
    const configs = await ProductConfigService.getAllProductConfigs();
    res.status(200).json({ success: true, data: configs });
  } catch (error) {
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

export const showConfigsByProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      res.status(400).json({ success: false, message: "require Product Id" });
      return;
    }
    const productConfigs = await ProductConfigService.getConfigsByProductId(
      Number(productId),
    );
    res.status(200).json({ success: true, data: productConfigs });
  } catch (error) {
    res.status(404).json({ success: false, message: "Server Error" });
  }
};

export const createProductConfig = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, configName, configType, priceModifier, isDefault } =
      req.body;

    if (
      !productId ||
      !configName ||
      !configType ||
      priceModifier === undefined
    ) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    const config = await ProductConfigService.createProductConfig({
      productId: Number(productId),
      configName,
      configType,
      priceModifier: BigInt(priceModifier),
      isDefault: isDefault ?? false,
    });

    res.status(201).json({ success: true, data: config });
  } catch (error: any) {
    if (error.code === "P2003") {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    console.error("Create config error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProductConfig = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { productId, configName, configType, priceModifier, isDefault } =
      req.body;

    if (
      !productId ||
      !configName ||
      !configType ||
      priceModifier === undefined
    ) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    const config = await ProductConfigService.updateProductConfig(id, {
      productId: Number(productId),
      configName,
      configType,
      priceModifier: BigInt(priceModifier),
      isDefault: isDefault ?? false,
    });

    res.status(200).json({ success: true, data: config });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "Config not found" });
      return;
    }
    console.error("Update config error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteProductConfig = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      res.status(400).json({ success: false, message: "require Product Id" });
      return;
    }
    await ProductConfigService.deleteProductConfig(id);
    res
      .status(201)
      .json({ success: true, message: "Successfuly Delete Configs" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Server Error" });
  }
};
