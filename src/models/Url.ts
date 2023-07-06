import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true },
    longUrl: { type: String, required: true, unique: true },
    shortUrl: { type: String, required: true, unique: true },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 3,
    },
  },
  { timestamps: true }
);

export const Url = mongoose.model("Url", urlSchema);
