import Upload from "../models/Upload.js";

export const uploadVideos = async (req, res, next) => {
    try {
        const { imgUrl, videoUrl } = req.body;
        // console.log(imgUrl, videoUrl);
        if (!imgUrl || !videoUrl) {
            return res
                .status(400)
                .json({ message: "Please provide all fields" });
            return next(new Error("imageUrl and videoUrl are required"));
        }
        const newUpload = new Upload({
            imgUrl,
            videoUrl,
        });
        const savedUpload = await newUpload.save();
        res.json(savedUpload);
    } catch (error) {
        console.log(error);
        res.status(500);
        next(error);
    }
};
