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
        <nav className="bg-gray-900 p-4 shadow-lg">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300 transition">
                    VaultX
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    <ul className="hidden md:flex items-center gap-6 text-white">
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

                    {/* Authentication Buttons */}
                    {token ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate("/auth")}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
