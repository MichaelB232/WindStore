import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import { AppError } from "../errors/AppError";
import * as AddressService from "../services/address.service";

// GET /api/addresses
export const getMyAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const addresses = await AddressService.getMyAddresses(userId);
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET /api/addresses/:id
export const getAddressById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const address = await AddressService.getAddressById(id, userId);
    if (!address) {
      res.status(404).json({ success: false, message: "Address not found" });
      return;
    }

    res.status(200).json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST /api/addresses
export const createAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      label,
      recipientName,
      phone,
      province,
      city,
      district,
      postalCode,
      fullAddress,
      isDefault,
    } = req.body;

    if (
      !label ||
      !recipientName ||
      !phone ||
      !province ||
      !city ||
      !district ||
      !postalCode ||
      !fullAddress
    ) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    const address = await AddressService.createAddress(userId, {
      label,
      recipientName,
      phone,
      province,
      city,
      district,
      postalCode,
      fullAddress,
      isDefault: isDefault ?? false,
    });

    res.status(201).json({ success: true, data: address });
  } catch (error) {
    console.error("createAddress error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT /api/addresses/:id
export const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);
    const {
      label,
      recipientName,
      phone,
      province,
      city,
      district,
      postalCode,
      fullAddress,
      isDefault,
    } = req.body;

    const address = await AddressService.updateAddress(id, userId, {
      label,
      recipientName,
      phone,
      province,
      city,
      district,
      postalCode,
      fullAddress,
      isDefault,
    });

    res.status(200).json({ success: true, data: address });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "Address not found" });
      return;
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PATCH /api/addresses/:id/default — set as default
export const setDefaultAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    const address = await AddressService.setDefaultAddress(id, userId);
    res.status(200).json({ success: true, data: address });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "Address not found" });
      return;
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE /api/addresses/:id
export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = Number(req.params.id);

    await AddressService.deleteAddress(id, userId);
    res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  } catch (error: any) {
    if (error instanceof AppError) {
      if (error.code === "ADDRESS_NOT_FOUND") {
        res
          .status(error.statusCode)
          .json({ success: false, message: error.message });
      }
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
