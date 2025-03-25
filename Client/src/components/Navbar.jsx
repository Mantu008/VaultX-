import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); // Get token from localStorage
    let userRole = null;

    if (token) {
        try {
            const decodedToken = jwtDecode(token); // Decode token
            userRole = decodedToken.role; // Extract role
        } catch (error) {
            console.error("Invalid token", error);
            localStorage.removeItem("token"); // Clear invalid token
            navigate("/auth"); // Redirect to login
        }
    }

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth"); // Redirect to login page
    };

    return (
        <nav className="bg-gray-800 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">VaultX</h1>

                {/* Show links only if logged in */}
                {token ? (
                    <div className="flex items-center space-x-6">
                        <ul className="flex space-x-6">
                            <li>
                                <Link to="/" className="hover:text-gray-300 transition">Home</Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-gray-300 transition">About</Link>
                            </li>

                            {/* Show Upload and Secure Upload only for Admin */}
                            {userRole === "admin" && (
                                <>
                                    <li>
                                        <Link to="/upload" className="hover:text-gray-300 transition">Upload</Link>
                                    </li>
                                    <li>
                                        <Link to="/secure-upload" className="hover:text-gray-300 transition">Secure Upload</Link>
                                    </li>
                                </>
                            )}
                        </ul>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/auth")}
                        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
