import { Request, Response } from "express";
import * as AuthService from "../services/user.service";
import { generateToken } from "../lib/jwt";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      res
        .status(400)
        .json({ success: false, message: "Username or email is required" });
      return;
    }
    if (!password) {
      res.status(400).json({ success: false, message: "Password is required" });
      return;
    }
    const user = await AuthService.getUserByUsername(username);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(404).json({ success: false, message: "Wrong Password" });
      return;
    }
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    res.status(400).json({
      success: true,
      message: "Login Successful",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email, role } = req.body;
    if (!username) {
      res
        .status(400)
        .json({ success: false, message: "Username or email is required" });
      return;
    }
    if (!password) {
      res.status(400).json({ success: false, message: "Password is required" });
      return;
    }
    if (!email) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }
    if (!role) {
      res.status(400).json({ successs: false, message: "Role is required" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await AuthService.createUser({
      username,
      passwordHash,
      email,
      role: role ?? "customer",
    });
    res.status(201).json({ success: true, message: "" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
