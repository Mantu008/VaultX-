import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
    {
        imgUrl: {
            type: String,
            required: false, // Image is optional
        },
        videoUrl: {
            type: String,
            required: false, // Video is optional
        },
        category: {
            type: String,
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ["image", "video"],
        },
        uploader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        likedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        likesCount: {
            type: Number,
            default: 0,
        },
        viewsCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Ensure at least one of imgUrl or videoUrl is present and infer type
uploadSchema.pre("save", function (next) {
    if (!this.imgUrl && !this.videoUrl) {
        return next(new Error("Either an image or a video is required."));
    }

    if (!this.type) {
        this.type = this.videoUrl ? "video" : "image";
    }

    next();
});

uploadSchema.index({ createdAt: -1 });
uploadSchema.index({ likesCount: -1 });

export default mongoose.model("Upload", uploadSchema);
