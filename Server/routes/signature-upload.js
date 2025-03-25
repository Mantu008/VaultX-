import express from "express";
import { createSignature } from "../controllers/signature-upload.js";

const router = express.Router();

// http://localhost:5000/api/signature-upload/

router.post("/", createSignature);

export default router;
