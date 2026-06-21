import mongoose from "mongoose";

export interface ILink {
  user: mongoose.Types.ObjectId;
  link: string;
  title: string;
  clickCount: number;
}

const linkSchema = new mongoose.Schema<ILink>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    link: {
      type: String,
      required: true,
      trim: true,
    },

    clickCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const linkModel = mongoose.model<ILink>("Link", linkSchema);

export default linkModel;
