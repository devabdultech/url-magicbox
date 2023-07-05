import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import urlRoutes from "./routes/urlRoutes";
import { Url } from "./models/Url";
import { connectDB } from "./lib/db";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
dotenv.config();

connectDB();

app.get("/", (_, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/url", urlRoutes);

app.get("/:url", async (req, res) => {
  const { url } = req.params;
  const entry = await Url.findOne({
    $or: [{ shortUrl: url }, { longUrl: url }],
  });

  if (entry) {
    res.redirect(entry.originalUrl);
  } else {
    // Handle invalid URL case
    res.status(404).send("URL not found");
  }
});

app.listen(PORT, () => {
  console.log(`Server started on Port ${PORT}`);
});
