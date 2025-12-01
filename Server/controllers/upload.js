import Upload from "../models/Upload.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

// Basic create (used by your existing upload flow)
export const uploadVideos = async (req, res) => {
    try {
        const { imgUrl, videoUrl, category } = req.body;

        if (!imgUrl && !videoUrl) {
            return res.status(400).json({ message: "Either an image or a video is required" });
        }
        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        const upload = new Upload({
            imgUrl,
            videoUrl,
            category,
            uploader: req.user?.id || null,
        });

        const saved = await upload.save();
        res.status(201).json(saved);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// List with filters + pagination + like/favorite info
export const getImagesVideos = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            type,
            sort = "newest",
        } = req.query;

        const query = {};
        if (category && category !== "all") query.category = category;
        if (type && type !== "all") query.type = type;

        const numericLimit = Math.min(Number(limit) || 12, 40);
        const numericPage = Math.max(Number(page) || 1, 1);
        const skip = (numericPage - 1) * numericLimit;

        const sortQuery =
            sort === "popular"
                ? { likesCount: -1, createdAt: -1 }
                : { createdAt: -1 };

        const [items, total] = await Promise.all([
            Upload.find(query)
                .populate("uploader", "username role")
                .sort(sortQuery)
                .skip(skip)
                .limit(numericLimit)
                .lean(),
            Upload.countDocuments(query),
        ]);

        const currentUserId = req.user?.id || null;
        const formatted = items.map((item) => {
            const likedBy = (item.likedBy || []).map((id) => id.toString());
            const uploaderId =
                item?.uploader?._id?.toString?.() ||
                item?.uploader?.toString?.() ||
                item?.uploader ||
                null;

            return {
                _id: item._id,
                imgUrl: item.imgUrl,
                videoUrl: item.videoUrl,
                type: item.type,
                category: item.category,
                likesCount: item.likesCount ?? likedBy.length,
                viewsCount: item.viewsCount ?? 0,
                createdAt: item.createdAt,
                uploader: item.uploader
                    ? {
                        _id: uploaderId,
                        username: item.uploader.username,
                        role: item.uploader.role,
                    }
                    : null,
                isLikedByCurrentUser: currentUserId ? likedBy.includes(currentUserId) : false,
            };
        });

        res.json({
            data: formatted,
            pagination: {
                page: numericPage,
                limit: numericLimit,
                total,
                totalPages: Math.ceil(total / numericLimit) || 1,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const likeMedia = async (req, res) => {
    try {
        const mediaId = req.params.id;
        const userId = req.user.id;

        const media = await Upload.findById(mediaId);
        if (!media) return res.status(404).json({ message: "Media not found" });

        const alreadyLiked = media.likedBy.some((id) => id.toString() === userId);

        if (alreadyLiked) {
            // Unlike
            media.likedBy = media.likedBy.filter((id) => id.toString() !== userId);
            media.likesCount = media.likedBy.length;
            await media.save();

            return res.json({
                message: "Unliked successfully",
                liked: false,
                likesCount: media.likesCount,
            });
        }

        // Like
        media.likedBy.push(userId);
        media.likesCount = media.likedBy.length;
        await media.save();

        res.json({
            message: "Liked successfully",
            liked: true,
            likesCount: media.likesCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Favorites toggle
export const toggleFavorite = async (req, res) => {
    try {
        const mediaId = req.params.id;
        const userId = req.user.id;

        const media = await Upload.findById(mediaId);
        if (!media) return res.status(404).json({ message: "Media not found" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const index = user.favorites.findIndex((favId) => favId.toString() === mediaId);
        let isFavorite;

        if (index >= 0) {
            user.favorites.splice(index, 1);
            isFavorite = false;
        } else {
            user.favorites.push(mediaId);
            isFavorite = true;
        }

        await user.save();

        res.json({ message: "Favorites updated", isFavorite });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get current user's favorites
export const getMyFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: "favorites",
            populate: { path: "uploader", select: "username role" },
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Comments
export const addComment = async (req, res) => {
    try {
        const mediaId = req.params.id;
        const userId = req.user.id;
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const media = await Upload.findById(mediaId);
        if (!media) return res.status(404).json({ message: "Media not found" });

        const comment = new Comment({
            media: mediaId,
            user: userId,
            text: text.trim(),
        });

        const saved = await comment.populate("user", "username role");
        await saved.save();

        res.status(201).json(saved);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getComments = async (req, res) => {
    try {
        const mediaId = req.params.id;

        const comments = await Comment.find({ media: mediaId })
            .populate("user", "username role")
            .sort({ createdAt: 1 });

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Increment views (for analytics)
export const incrementViews = async (req, res) => {
    try {
        const mediaId = req.params.id;

        const media = await Upload.findByIdAndUpdate(
            mediaId,
            { $inc: { viewsCount: 1 } },
            { new: true }
        );

        if (!media) return res.status(404).json({ message: "Media not found" });

        res.json({ viewsCount: media.viewsCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Simple analytics (admin)
export const getMediaAnalytics = async (req, res) => {
    try {
        const [byCategory, mostLiked] = await Promise.all([
            Upload.aggregate([
                { $group: { _id: "$category", uploads: { $sum: 1 }, totalLikes: { $sum: "$likesCount" }, totalViews: { $sum: "$viewsCount" } } },
                { $sort: { uploads: -1 } },
            ]),
            Upload.find().sort({ likesCount: -1 }).limit(10).select("imgUrl videoUrl category likesCount viewsCount"),
        ]);

        res.json({
            byCategory,
            mostLiked,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
