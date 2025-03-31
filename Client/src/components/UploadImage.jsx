import { useState, useRef } from "react";
import axios from "axios";
import { Circles } from "react-loader-spinner";

const UploadImage = () => {
    const [category, setCategory] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const fileInputRef = useRef(null);

    const categories = [
        "Wedding", "Birthday", "Haldi", "Engagement", "Anniversary",
        "Graduation", "Baby Shower", "Corporate Event", "Travel", "Nature",
        "Portrait", "Fashion", "Food", "Sports", "Pets", "Architecture",
        "Technology", "Music", "Festival", "Art"
    ];

    const getSignatureForUpload = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_REACT_BACKEND_APP_API_URL}/api/signature-upload`, { folder: "media" });
            return res.data;
        } catch (error) {
            console.error("Signature Fetch Error:", error);
            throw new Error("Failed to generate upload signature");
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
            throw new Error("File upload failed");
        }
    };

    const handleUpload = async () => {
        if (!category) {
            setError("Please select a category");
            return;
        }
        if (!file) {
            setError("Please select a file to upload");
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const signatureData = await getSignatureForUpload();
            const fileUrl = await uploadFile(file, signatureData.timestamp, signatureData.signature);

            await axios.post(`${import.meta.env.VITE_REACT_BACKEND_APP_API_URL}/api/upload`, {
                imgUrl: fileUrl,
                category
            });

            setSuccess("Upload successful!");
            setCategory("");
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            setError(error.message || "Upload failed. Please try again.");
            console.error("Upload Failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate file size (e.g., 10MB max)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (selectedFile.size > maxSize) {
                setError("File size too large (max 10MB)");
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                return;
            }

            // Validate file type
            const validTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"];
            if (!validTypes.includes(selectedFile.type)) {
                setError("Invalid file type. Please upload an image (JPEG, PNG, GIF) or video (MP4, MOV)");
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                return;
            }

            setError("");
            setFile(selectedFile);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Upload Your Media</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg">
                    {success}
                </div>
            )}

            <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-2">
                    Select Category <span className="text-red-500">*</span>
                </label>
                <select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setError("");
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    disabled={loading}
                >
                    <option value="">-- Choose Category --</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat.toLowerCase()}>{cat}</option>
                    ))}
                </select>
            </div>

            <div className="mb-5">
                <label className="block text-gray-700 font-medium mb-2">
                    Upload File <span className="text-red-500">*</span>
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={loading}
                    />
                    <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600">
                            {file ? file.name : "Click to browse or drag and drop"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Supported formats: JPEG, PNG, GIF, MP4, MOV (Max 10MB)
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={handleUpload}
                className={`w-full mt-2 py-3 px-4 rounded-lg font-semibold text-white transition duration-200 flex items-center justify-center
                ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"}`}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Circles height="20" width="20" color="#ffffff" ariaLabel="loading" className="mr-2" />
                        Uploading...
                    </>
                ) : (
                    "Upload Media"
                )}
            </button>
        </div>
    );
};

export default UploadImage;