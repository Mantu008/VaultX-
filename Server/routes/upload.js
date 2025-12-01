import express from "express";
import {
    uploadVideos,
    getImagesVideos,
    likeMedia,
    toggleFavorite,
    getMyFavorites,
    addComment,
    getComments,
    incrementViews,
    getMediaAnalytics,
} from "../controllers/upload.js";
import { protect, isAdmin, attachUserIfExists } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public list (with optional filters)
router.get("/", attachUserIfExists, getImagesVideos);

// Upload (you can keep open or restrict to admin)
router.post("/", protect, uploadVideos);

// Likes
router.post("/:id/like", protect, likeMedia);

// Favorites
router.post("/:id/favorite", protect, toggleFavorite);
router.get("/me/favorites", protect, getMyFavorites);

// Comments
router.post("/:id/comments", protect, addComment);
router.get("/:id/comments", getComments);

// Views
router.post("/:id/view", incrementViews);

// Analytics (admin only)
router.get("/admin/analytics", protect, isAdmin, getMediaAnalytics);

export default router;
