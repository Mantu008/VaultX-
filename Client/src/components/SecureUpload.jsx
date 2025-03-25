import React, { useState } from "react";
import axios from "axios";
import { Circles } from "react-loader-spinner"; // Import loader

const SecureUpload = () => {
    const [video, setVideo] = useState(null);
    const [img, setImg] = useState(null);
    const [loading, setLoading] = useState(false);

    const uploadFile = async (file, type, timestamp, signature) => {
        if (!file) return null; // Prevent unnecessary uploads

        const folder = type === "image" ? "images" : "videos";

        const data = new FormData();
        data.append("file", file);
        data.append("timestamp", timestamp);
        data.append("signature", signature);
        data.append("api_key", import.meta.env.VITE_REACT_APP_CLOUDINARY_API_KEY);
        data.append("folder", folder);

        try {
            const cloudName = import.meta.env.VITE_REACT_APP_CLOUD_NAME;
            const resourceType = type === "image" ? "image" : "video";
            const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            const res = await axios.post(apiUrl, data);
            // console.log(`${type} Upload Success:`, res.data);
            return res.data.secure_url;
        } catch (error) {
            console.error(`${type} Upload Error:`, error.response?.data || error.message);
            return null;
        }
    };

    const getSignatureForUpload = async (folder) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_REACT_BACKEND_APP_API_URL}/api/signature-upload`,
                { folder }
            );
            return res.data;
        } catch (error) {
            console.error("Signature Fetch Error:", error.response?.data || error.message);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!img && !video) {
            alert("Please select a file to upload.");
            return;
        }

        setLoading(true);

        try {
            // Generate signatures
            const imgSignatureData = img ? await getSignatureForUpload("images") : null;
            const videoSignatureData = video ? await getSignatureForUpload("videos") : null;

            // Upload files
            const imgUrl = imgSignatureData ? await uploadFile(img, "image", imgSignatureData.timestamp, imgSignatureData.signature) : null;
            const videoUrl = videoSignatureData ? await uploadFile(video, "video", videoSignatureData.timestamp, videoSignatureData.signature) : null;

            // Send data to backend
            await axios.post(`${import.meta.env.VITE_REACT_BACKEND_APP_API_URL}/api/upload`, { imgUrl, videoUrl });

            // Reset states
            setImg(null);
            setVideo(null);
            alert("Upload successful!");
        } catch (error) {
            console.error("Upload Failed:", error);
            alert("Upload failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="video">Video:</label>
                    <br />
                    <input
                        type="file"
                        accept="video/*"
                        id="video"
                        onChange={(e) => setVideo(e.target.files[0])}
                    />
                </div>
                <br />
                <div>
                    <label htmlFor="img">Image:</label>
                    <br />
                    <input
                        type="file"
                        accept="image/*"
                        id="img"
                        onChange={(e) => setImg(e.target.files[0])}
                    />
                </div>
                <br />

                <button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </button>

                {loading && (
                    <div style={{ marginTop: "10px" }}>
                        <Circles height="50" width="50" color="#4fa94d" ariaLabel="loading" />
                    </div>
                )}
            </form>
        </div>
    );
};

export default SecureUpload;
