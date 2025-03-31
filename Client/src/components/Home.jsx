import { useState, useEffect } from "react";
import axios from "axios";
import MediaGallery from "../components/MediaGallery";
import { jwtDecode } from "jwt-decode";

const Home = () => {
    const [media, setMedia] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
                } else {
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error("Invalid token:", error);
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

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Gallery</h1>
            <MediaGallery media={media} isAuthenticated={isAuthenticated} />
        </div>
    );
};

export default Home;
