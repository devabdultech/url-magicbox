import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true },
    longUrl: { type: String, required: true, unique: true },
    shortUrl: { type: String, required: true, unique: true },
    expireAt: { type: Date, default: Date.now, index: { expires: "3d" } },
  },
  { timestamps: true }
);

export const Url = mongoose.model("Url", urlSchema);
