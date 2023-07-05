import express from "express";
import handleGenerateUrl from "../controllers/urlController";

const router = express.Router();

router.post("/", handleGenerateUrl);

export default router;
