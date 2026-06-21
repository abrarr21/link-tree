import { StatusCodes } from "http-status-codes";
import { userDAO } from "../dao/user.dao.js";
import type { IUser } from "../models/user.model.js";
import ApiError from "../utils/app.error.js";
import jwt from "jsonwebtoken";
import env from "../config/config.js";

export class AuthService {
  private JWT_SECRET = env.JWT_SECRET;

  async register(data: IUser): Promise<Omit<IUser, "password">> {
    // verify email uniqueness
    const existingUser = await userDAO.findByEmail(data.email);
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, "Email already exists");
    }

    // verify username uniqueness
    const existingUsername = await userDAO.findByUsername(data.username);
    if (existingUsername) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Username is already taken");
    }

    // create the user
    const user = await userDAO.create(data);
    const userObj = user.toObject();

    delete (userObj as any).password;
    return userObj;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: Omit<IUser, "password">; token: string }> {
    // find user with their password
    const user = await userDAO.findByEmailWithPassword(email);
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }

    // verify password using the interface method on the model
    const isMatch = await user.matchedPassword(password);
    if (!isMatch) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "invalid email or password");
    }

    // create a JWT session token
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      this.JWT_SECRET,
      { expiresIn: "24h" },
    );

    const userObj = user.toObject();
    delete (userObj as any).password;

    return { user: userObj, token };
  }
}

export const authService = new AuthService();
