import Upload from "../models/Upload.js";

export const uploadVideos = async (req, res, next) => {
    try {
        const { imgUrl, videoUrl, category } = req.body;

        // Validate required fields
        if (!imgUrl && !videoUrl) {
            return res
                .status(400)
                .json({ message: "Either an image or a video is required" });
        }

        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        // Create a new upload document
        const newUpload = new Upload({
            imgUrl,
            videoUrl,
            category,
        });

        const savedUpload = await newUpload.save();
        res.status(201).json(savedUpload);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const getImagesVideos = async (req, res, next) => {
    try {
        const uploads = await Upload.find(); // Fetch all documents
        res.status(200).json(uploads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
