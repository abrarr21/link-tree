import mongoose from "mongoose";
import { linkDAO, type LinkDocument } from "../dao/link.dao.js";
import linkModel from "../models/link.model.js";
import { userDAO } from "../dao/user.dao.js";
import ApiError from "../utils/app.error.js";
import { StatusCodes } from "http-status-codes";

class LinkService {
  async createLink(
    userId: string,
    linkUrl: string,
    title: string,
  ): Promise<LinkDocument> {
    return await linkModel.create({ user: userId, link: linkUrl, title });
  }

  // resolve whether the user param is an ObjectId or a username
  private async resolveUser(userParam: string) {
    let user = null;
    if (mongoose.Types.ObjectId.isValid(userParam)) {
      user = await userDAO.findById(userParam);
    }
    if (!user) {
      user = await userDAO.findByUsername(userParam);
    }
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "user not found");
    }
    return user;
  }

  async getLinkByUser(userParam: string): Promise<LinkDocument[]> {
    const user = await this.resolveUser(userParam);
    return await linkDAO.findByUserId(user._id.toString());
  }

  async getLinkAnalytics(
    userParam: string,
    authUserId: string,
  ): Promise<{
    totalLinks: number;
    totalClicks: number;
    links: Array<{ id: string; link: string; clickCount: number }>;
  }> {
    const user = await this.resolveUser(userParam);

    if (user._id.toString() !== authUserId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to view this user's analytics",
      );
    }

    const links = await linkDAO.findByUserId(user._id.toString());
    const totalLinks = links.length;
    const totalClicks = links.reduce(
      (acc, curr) => acc + (curr.clickCount || 0),
      0,
    );

    const linkDetails = links.map((l) => ({
      id: l._id.toString(),
      link: l.link,
      clickCount: l.clickCount,
    }));
    return {
      totalLinks,
      totalClicks,
      links: linkDetails,
    };
  }

  async incrementClick(linkId: string): Promise<LinkDocument> {
    const link = await linkModel.findById(linkId);
    if (!link) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Link not found");
    }

    link.clickCount += 1;
    return await link.save();
  }

  async deleteLink(linkId: string, authUserId: string): Promise<void> {
    const link = await linkModel.findById(linkId);
    if (!link) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Link not found");
    }

    if (link.user.toString() !== authUserId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to delete this",
      );
    }

    await linkDAO.deleteLink(linkId);
  }
}

export const linkService = new LinkService();
