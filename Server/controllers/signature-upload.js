import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // Ensure env variables are loaded

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    secure: true,
});

export const createSignature = async (req, res) => {
    const { folder } = req.body;
    if (!folder) {
        return res.status(400).json({ message: "Folder is required" });
    }

    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request(
            { timestamp, folder },
            process.env.CLOUDINARY_SECRET_KEY
        );

        // console.log("Generated Signature:", signature, "Timestamp:", timestamp);

        return res.status(200).json({ signature, timestamp });
    } catch (error) {
        console.error("Cloudinary Signature Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
