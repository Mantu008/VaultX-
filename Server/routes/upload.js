import express from "express";
import { uploadVideos } from "../controllers/upload.js";
import { getImagesVideos } from "../controllers/upload.js";

const router = express.Router();

// http://localhost:5000/api/upload/

router.get("/", getImagesVideos);
router.post("/", uploadVideos);

export default router;
