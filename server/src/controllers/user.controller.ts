import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middlewares";
import * as UserService from "../services/user.service";

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

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    // Prevent admin from deleting themselves
    if (id === req.user!.id) {
      res
        .status(400)
        .json({ success: false, message: "Cannot delete your own account" });
      return;
    }

    await UserService.deleteUser(id);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    if (error.code === "P2003") {
      res.status(409).json({
        success: false,
        message: "Cannot delete user that has orders",
      });
      return;
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
