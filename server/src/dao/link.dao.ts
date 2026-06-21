import type mongoose from "mongoose";
import type { ILink } from "../models/link.model.js";
import linkModel from "../models/link.model.js";

export type LinkDocument = mongoose.HydratedDocument<ILink>;

class LinkDAO {
  // create a new link
  async create(data: {
    user: string | mongoose.Types.ObjectId;
    link: string;
  }): Promise<LinkDocument> {
    return await linkModel.create(data);
  }

  // find all links of a user
  async findByUserId(
    userId: string | mongoose.Types.ObjectId,
  ): Promise<LinkDocument[]> {
    return (await linkModel.find({ user: userId }).exec()) as LinkDocument[];
  }

  // increment click count for analytics tracking
  async incrementClicks(id: string): Promise<LinkDocument | null> {
    return (await linkModel
      .findByIdAndUpdate(id, { $inc: { clickCount: 1 } }, { new: true })
      .exec()) as LinkDocument | null;
  }

  // delete link
  async deleteLink(linkId: string): Promise<LinkDocument | null> {
    return await linkModel.findByIdAndDelete(linkId).exec();
  }
}

export const linkDAO = new LinkDAO();
