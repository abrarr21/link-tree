import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  name: string;
  email: string;
  username: string;
  password: string;
}

// Describe the custom interface methods on the document
export interface IUserMethods {
  matchedPassword(enteredPassword: string): Promise<boolean>;
}

// combines data fields knowledge + methods knowledge into one model type
type UserModel = mongoose.Model<IUser, {}, IUserMethods>;

// Wire all three into the schema
const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },

    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw error;
  }
});

userSchema.methods.matchedPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model<IUser, UserModel>("User", userSchema);

export default userModel;
