import mongoose from "mongoose";

const uploadSchema = mongoose.Schema(
    {
        imgUrl: {
            type: String,
            required: true,
        },
        videoUrl: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Upload", uploadSchema);
