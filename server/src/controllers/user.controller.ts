import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import * as UserService from "../services/user.service";
import { AppError } from "../errors/AppError";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await UserService.getUserById(id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { username, email } = req.body;

    if (!username && !email) {
      res.status(400).json({ success: false, message: "Nothing to update" });
      return;
    }

    const user = await UserService.updateUser(userId, { username, email });
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    if (error.code === "P2002") {
      res
        .status(409)
        .json({ success: false, message: "Username or email already taken" });
      return;
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteMe = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.user?.id);

    await UserService.deleteUser(id);

    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (error: any) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
      return;
    }
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    console.error("deleteMe error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  // delete account from admin side
  try {
    const id = Number(req.params.id);

    if (!id) {
      res.status(400).json({ success: false, message: "Invalid user ID" });
      return;
    }

    // Prevent admin from deleting themselves
    if (id === req.user!.id) {
      res
        .status(400)
        .json({ success: false, message: "Cannot delete own admin account" });
      return;
    }

    await UserService.deleteUser(id);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
      return;
    }
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
