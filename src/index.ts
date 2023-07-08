import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import urlRoutes from "./routes/urlRoutes";
import { Url } from "./models/Url";
import { connectDB } from "./lib/db";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

connectDB();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/analytics", async (_, res: Response) => {
  try {
    const analyticsData = await Url.find(
      {},
      "shortUrl longUrl originalUrl clicks"
    );
    res.json({ data: analyticsData });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analytics data" });
  }
});

app.delete("/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Url.findOneAndDelete({ _id: id });
    res.status(200).json({ message: "URL deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete URL" });
  }
});

app.get("/:url", async (req: Request, res: Response) => {
  const { url } = req.params;
  const entry = await Url.findOneAndUpdate(
    {
      $or: [{ shortUrl: url }, { longUrl: url }],
    },
    { $inc: { clicks: 1 } }
  );

  if (entry) {
    res.redirect(entry.originalUrl);
  } else {
    // Handle invalid URL case
    res.status(404).send("URL not found");
  }
});

app.use("/url", urlRoutes);

app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});
