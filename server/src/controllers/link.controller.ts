import type { NextFunction, Request, Response } from "express";
import { linkService } from "../services/link.service.js";
import sendResponse from "../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";

class LinkController {
  create = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User context missing");
      }

      const { link, title } = req.body;
      const newLink = await linkService.createLink(userId, link, title);
      sendResponse(
        res,
        StatusCodes.CREATED,
        "Link created successfully",
        newLink,
      );
    } catch (error) {
      next(error);
    }
  };

  getByUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { user } = req.params;
      if (!user) {
        throw new Error("User parameter missing");
      }

      const links = await linkService.getLinkByUser(user as string);
      sendResponse(res, StatusCodes.OK, "Links fetched successfully", links);
    } catch (error) {
      next(error);
    }
  };

  getAnalytics = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { user } = req.params;
      const authUserId = req.user?.id;
      if (!user || !authUserId) {
        throw new Error("Required parameters missing");
      }

      const analytics = await linkService.getLinkAnalytics(
        user as string,
        authUserId,
      );
      sendResponse(
        res,
        StatusCodes.OK,
        "analytics fetched successfully",
        analytics,
      );
    } catch (error) {
      next(error);
    }
  };
}

export const linkController = new LinkController();
