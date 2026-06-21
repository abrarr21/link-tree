import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../utils/sendResponse.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import env from "../config/config.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    sendResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      "Access denied. No token provided",
    );
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    sendResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      "invalid token or expired token",
    );
  }
};
