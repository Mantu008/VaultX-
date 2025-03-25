import { useState, useEffect } from "react";
import API from "../api";
import ImageCard from "../components/ImageCard";
import { jwtDecode } from "jwt-decode";

const Home = () => {
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    let userRole = token ? jwtDecode(token).role : "user";

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        const res = await API.get("/images");
        setImages(res.data);
    };

    const handleUpload = async () => {
        if (!category || !file) {
            alert("Please select a category and file");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);

        try {
            await API.post("/upload", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchImages();
            alert("Upload Successful!");
        } catch (error) {
            alert("Upload Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Gallery</h1>

            {userRole === "admin" && (
                <div className="mt-4">
                    <select onChange={(e) => setCategory(e.target.value)} className="border p-2">
                        <option value="">Select Category</option>
                        <option value="wedding">Wedding</option>
                        <option value="birthday">Birthday</option>
                        <option value="haldi">Haldi</option>
                    </select>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} className="ml-4" />
                    <button onClick={handleUpload} className="bg-blue-500 px-4 py-2 rounded ml-4">
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            )}

            <div className="grid grid-cols-3 gap-4 mt-6">
                {images.map((img) => (
                    <ImageCard key={img._id} image={img} canDownload={token} />
                ))}
            </div>
        </div>
    );
};

export default Home;


