import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import * as OrderService from "../services/order.service";

export const getOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const publicId = req.params.publicId as string; // ← fix here

    const order = await OrderService.findOrderStatus(publicId, userId);
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("getOrderStatus error:", error); // ← add this for debugging next time
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orders = await OrderService.getMyOrders(userId);
    if (!orders) {
      res
        .status(404)
        .json({ success: false, message: "Kau gapunya orderan apa" });
      return;
    }
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
