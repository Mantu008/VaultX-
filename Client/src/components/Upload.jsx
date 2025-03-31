import React, { useState } from "react";
import axios from "axios";
import { Circles } from "react-loader-spinner"; // Import loader
import { useNavigate } from "react-router-dom";

const Upload = () => {
    const [video, setVideo] = useState(null);
    const [img, setImg] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const uploadFile = async (type) => {
        const data = new FormData();
        data.append('file', type === 'image' ? img : video);
        data.append('upload_preset', type === 'image' ? 'images_preset' : 'videos_preset');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loader
        try {
            // Upload image file
            const imgUrl = await uploadFile('image');
            // Upload video file
            const videoUrl = await uploadFile('video');

            // Send data to backend API
            await axios.post(`${import.meta.env.VITE_REACT_BACKEND_APP_API_URL}/api/upload`, { imgUrl, videoUrl });

            // Reset state
            setVideo(null);
            setImg(null);
            alert('Upload successful!');
            navigate('/'); // Redirect to home page after upload
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

export default Upload;
