import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true },
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    click: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Url = mongoose.model("Url", urlSchema);
