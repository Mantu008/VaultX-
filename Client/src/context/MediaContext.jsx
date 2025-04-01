import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Create context
export const MediaContext = createContext();

export const MediaProvider = ({ children }) => {
    const [media, setMedia] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthentication();
        fetchMedia();
    }, []);

    useEffect(() => {
        // Listen for changes in authentication (token added/removed)
        const handleAuthChange = () => {
            checkAuthentication();
        };

        window.addEventListener("storage", handleAuthChange);
        return () => window.removeEventListener("storage", handleAuthChange);
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
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    };

    const fetchMedia = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_REACT_BACKEND_APP_API_URL}/api/upload`);
            setMedia(res.data);
        } catch (error) {
            console.error("Error fetching media:", error);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    return (
        <MediaContext.Provider value={{ media, isAuthenticated, setIsAuthenticated, loading }}>
            {children}
        </MediaContext.Provider>
    );
};
