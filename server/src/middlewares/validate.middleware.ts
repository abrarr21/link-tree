import { ZodError, type ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/app.error.js";
import { StatusCodes } from "http-status-codes";

export const validate = (schema: ZodType) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as { body?: any; query?: any; params?: any };

      req.body = parsed.body;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            "Validation error",
            error.issues,
          ),
        );
        return;
      }
      next(error);
    }
  };
};
