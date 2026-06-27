import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import * as PaymentService from "../services/payment.service";
import * as OrderService from "../services/order.service";

export const checkout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      res.status(400).json({ success: false, message: "Cart is empty" });
      return;
    }
    const result = await PaymentService.createPayment(userId, cartItems);
    res.status(201).json({
      success: true,
      data: {
        orderId: result.orderId,
        token: result.token, // ← FE uses this!
        redirectUrl: result.redirectUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const webhook = async (req: Request, res: Response) => {
  try {
    const notification = req.body;
    console.log("Webhook received : ", notification);

    const result = PaymentService.handleWebhook(notification);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
