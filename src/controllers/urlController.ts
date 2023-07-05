import { nanoid } from "nanoid";
import { Url } from "../models/Url";

const handleGenerateUrl = async (req, res) => {
  const body = req.body;
  const shortID = nanoid(5);
  const longID = nanoid(70);

  if (!body) return res.status(400).json({ message: "No url found" });

  await Url.create({
    originalUrl: body.url,
    shortUrl: shortID,
    longUrl: longID,
  });

  return res.json({ shortUrl: shortID, longUrl: longID });
};

export default handleGenerateUrl;
