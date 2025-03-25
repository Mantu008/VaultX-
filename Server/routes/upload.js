import express from "express";
import { uploadVideos } from "../controllers/upload.js";

const router = express.Router();

// http://localhost:5000/api/upload/

router.post("/", uploadVideos);

export default router;
