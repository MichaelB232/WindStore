import { Request, Response } from "express";
import * as AuthService from "../services/user.service";
import { generateToken } from "../lib/jwt";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middlewares";

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
      res.status(401).json({ success: false, message: "Wrong Password" });
      return;
    }
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
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

    const passwordHash = await bcrypt.hash(password, 10);
    await AuthService.createUser({
      username,
      passwordHash,
      email,
      role: "customer",
    });
    res.status(201).json({ success: true, message: "Register successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await AuthService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      isLoggedIn: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out",
  });
};
