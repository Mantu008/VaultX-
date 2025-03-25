import React, { useState } from "react";
import axios from "axios";
import { Circles } from "react-loader-spinner"; // Import loader

const SecureUpload = () => {
    const [video, setVideo] = useState(null);
    const [img, setImg] = useState(null);
    const [loading, setLoading] = useState(false);

    const uploadFile = async (type, timestamp, signature) => {
        const data = new FormData();
        data.append('file', type === 'image' ? img : video);
        data.append('timestamp', timestamp);
        data.append('signature', signature);
        data.append("api_key", import.meta.env.VITE_REACT_APP_CLOUDINARY_API_KEY);

        try {
            let cloudName = import.meta.env.VITE_REACT_APP_CLOUD_NAME;
            let resourceType = type === 'image' ? 'image' : 'video';
            let apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
            let res = await axios.post(apiUrl, data);
            const { secure_url } = res.data;
            console.log(secure_url);
            return secure_url;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const getSignatureForUpload = async (folder) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_REACT_BACKEND_APP_API_URL}/api/signature-upload`, { folder });
            return res.data;
        } catch (error) {
            console.log(error);

        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loader

        const { timestamp: imgTimestamp, signature: imgSignature } = await getSignatureForUpload('image');
        const { timestamp: videoTimestamp, signature: videoSignature } = await getSignatureForUpload('video');


        try {
            // Upload image file
            const imgUrl = await uploadFile('image', imgTimestamp, imgSignature);
            // Upload video file
            const videoUrl = await uploadFile('video', videoTimestamp, videoSignature);

            // Send data to backend API
            // await axios.post(`${import.meta.env.VITE_REACT_BACKEND_APP_API_URL}/api/upload`, { imgUrl, videoUrl });

            // Reset state
            setVideo(null);
            setImg(null);
            alert('Upload successful!');
        } catch (error) {
            console.log(error);
            alert('Upload failed!');
        }
        setLoading(false); // Hide loader
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

                {/* Show Loader when Uploading */}
                {loading && (
                    <div style={{ marginTop: "10px" }}>
                        <Circles
                            height="50"
                            width="50"
                            color="#4fa94d"
                            ariaLabel="loading"
                        />
                    </div>
                )}
            </form>
        </div>
    );
};

export default SecureUpload;

