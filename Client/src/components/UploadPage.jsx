import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UploadImage from "../components/UploadImage";

const UploadPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("No token found. Redirecting to login.");
            navigate("/login");
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            // console.log("Decoded Token:", decodedToken);

            if (decodedToken.exp * 1000 > Date.now()) {
                setIsAuthenticated(true);
                setUserRole(decodedToken.role);
            } else {
                console.log("Token expired. Redirecting to login.");
                localStorage.removeItem("token");
                navigate("/login");
            }
        } catch (error) {
            console.error("Invalid token:", error);
            navigate("/login");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Upload Image</h1>
            {isAuthenticated && userRole === "admin" ? (
                <UploadImage />
            ) : (
                <p className="text-red-500">You are not authorized to upload images.</p>
            )}
        </div>
    );
};

export default UploadPage;
