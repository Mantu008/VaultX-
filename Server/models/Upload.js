import mongoose from "mongoose";

const uploadSchema = mongoose.Schema(
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
        },
    },
    {
        timestamps: true,
    }
);

// Ensure at least one of imgUrl or videoUrl is present
uploadSchema.pre("save", function (next) {
    if (!this.imgUrl && !this.videoUrl) {
        return next(new Error("Either an image or a video is required."));
    }
    next();
});

export default mongoose.model("Upload", uploadSchema);
