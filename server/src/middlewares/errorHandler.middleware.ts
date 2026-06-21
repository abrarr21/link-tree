import { StatusCodes } from "http-status-codes";
import { logger } from "../config/logger.js";
import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }

  let { statusCode, message } = err;

  if (!statusCode) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = "Internal server error";
  }

  if (statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
    logger.error(
      { err, path: req.originalUrl, method: req.method },
      "Server error caught by global handler",
    );
  } else {
    logger.warn(
      { message, statusCode, path: req.originalUrl },
      "Client error caught by global handler",
    );
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.errors && { errors: err.errors }),
  });
};
