import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Circles } from "react-loader-spinner";
import ImageCard from "../components/ImageCard";
import { jwtDecode } from "jwt-decode";

const Home = () => {
    const [media, setMedia] = useState([]);
    const [category, setCategory] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null); // Store user role
    const fileInputRef = useRef(null);

    useEffect(() => {
        checkAuthentication();
        fetchMedia();
    }, []);

    const checkAuthentication = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 > Date.now()) {
                    setIsAuthenticated(true);
                    setUserRole(decodedToken.role); // Store role
                } else {
                    localStorage.removeItem("token");
                    setIsAuthenticated(false);
                    setUserRole(null);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                setIsAuthenticated(false);
                setUserRole(null);
            }
        }
    };

    const fetchMedia = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_REACT_BACKEND_APP_API_URL}/api/upload`);
            setMedia(res.data);
        } catch (error) {
            console.error("Error fetching media:", error);
        }
    };

    const getSignatureForUpload = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_REACT_BACKEND_APP_API_URL}/api/signature-upload`, { folder: "media" });
            return res.data;
        } catch (error) {
            console.error("Signature Fetch Error:", error);
            return null;
        }
    };

    const uploadFile = async (file, timestamp, signature) => {
        if (!file) return null;

        const data = new FormData();
        data.append("file", file);
        data.append("timestamp", timestamp);
        data.append("signature", signature);
        data.append("api_key", import.meta.env.VITE_REACT_APP_CLOUDINARY_API_KEY);
        data.append("folder", "media");

        try {
            const cloudName = import.meta.env.VITE_REACT_APP_CLOUD_NAME;
            const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

            const res = await axios.post(apiUrl, data);
            return res.data.secure_url;
        } catch (error) {
            console.error("Upload Error:", error);
            return null;
        }
    };

    const handleUpload = async () => {
        if (!category || !file) {
            alert("Please select a category and file");
            return;
        }

        setLoading(true);

        try {
            const signatureData = await getSignatureForUpload();
            if (!signatureData) {
                alert("Failed to generate signature.");
                setLoading(false);
                return;
            }

            const fileUrl = await uploadFile(file, signatureData.timestamp, signatureData.signature);
            if (!fileUrl) {
                alert("Upload failed!");
                setLoading(false);
                return;
            }

            await axios.post(`${import.meta.env.VITE_REACT_BACKEND_APP_API_URL}/api/upload`, { imgUrl: fileUrl, category });

            fetchMedia();
            alert("Upload successful!");

            setCategory("");
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Upload Failed:", error);
            alert("Upload failed!");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (url) => {
        try {
            const response = await axios.get(url, { responseType: "blob" });
            const blob = new Blob([response.data]);
            const link = document.createElement("a");

            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", url.split("/").pop());
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download file.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Gallery</h1>

            {/* Show Upload Section only if User is Admin */}
            {isAuthenticated && userRole === "admin" && (
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                    <select onChange={(e) => setCategory(e.target.value)} className="border p-2">
                        <option value="">Select Category</option>
                        <option value="wedding">Wedding</option>
                        <option value="birthday">Birthday</option>
                        <option value="haldi">Haldi</option>
                    </select>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="border p-2"
                    />
                    <button
                        onClick={handleUpload}
                        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                    {loading && <Circles height="50" width="50" color="#4fa94d" ariaLabel="loading" />}
                </div>
            )}

            {/* Display Uploaded Media */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {media.length > 0 ? (
                    media.map((item, index) => (
                        <div key={index} className="relative">
                            <ImageCard media={item.imgUrl} category={item.category} />
                            {isAuthenticated && (
                                <button
                                    onClick={() => handleDownload(item.imgUrl)}
                                    className="absolute bottom-2 right-2 bg-green-500 text-white px-3 py-1 rounded"
                                >
                                    Download
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No media available</p>
                )}
            </div>
        </div>
    );
};

export default Home;
