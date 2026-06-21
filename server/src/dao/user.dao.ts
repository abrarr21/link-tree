import type mongoose from "mongoose";
import type { IUser, IUserMethods } from "../models/user.model.js";
import userModel from "../models/user.model.js";

export type UserDocument = mongoose.HydratedDocument<IUser, IUserMethods>;

export class UserDao {
  // Create a new user
  async create(data: Partial<IUser>): Promise<UserDocument> {
    return await userModel.create(data);
  }

  // Find a user by email
  // .exec() converts a Mongoose "query description" into an actual database call that returns a Promise.
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  // Find a user by username
  async findByUsername(username: string): Promise<UserDocument | null> {
    return await userModel.findOne({ username: username.toLowerCase() }).exec();
  }

  // Find a user by email and select the password field (needed for authentication)
  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return await userModel
      .findOne({ email: email.toLowerCase() })
      .select("+password")
      .exec();
  }

  // Find user by id
  async findById(id: string): Promise<UserDocument | null> {
    return await userModel.findById(id).exec();
  }
}

export const userDAO = new UserDao();
