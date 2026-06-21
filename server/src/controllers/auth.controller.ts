import type { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import sendResponse from "../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import env from "../config/config.js";

export class AuthController {
  // register controller
  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await authService.register(req.body);
      sendResponse(
        res,
        StatusCodes.CREATED,
        "User registered successfully",
        user,
      );
    } catch (error) {
      next(error);
    }
  };

  // login controller
  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);

      // set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      });

      sendResponse(res, StatusCodes.OK, "Login successful", { user, token });
    } catch (error) {
      next(error);
    }
  };

  // logout controller
  logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      res.clearCookie("token");
      sendResponse(res, StatusCodes.OK, "Logged out successfully");
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
