import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        coverMedia: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Upload",
        },
        mediaItems: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Upload",
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Album", albumSchema);


