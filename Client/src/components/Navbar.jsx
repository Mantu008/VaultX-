import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        navigate("/auth");
        window.location.reload(); // Force component refresh
    };


    return (
        <nav className="bg-gray-900 p-4 shadow-lg">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300 transition">
                    VaultX
                </Link>

                {/* Hamburger menu button (visible on mobile) */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-6">
                    <ul className="flex items-center gap-6 text-white">
                        <li>
                            <Link to="/" className="hover:text-gray-300 transition">
                                Gallery
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-gray-300 transition">
                                About
                            </Link>
                        </li>

                        {/* Show Upload and Secure Upload only for Admin */}
                        {userRole === "admin" && (
                            <>
                                <li>
                                    <Link to="/upload-image" className="hover:text-gray-300 transition">
                                        Upload Image
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link to="/upload" className="hover:text-gray-300 transition">
                                        Upload
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/secure-upload" className="hover:text-gray-300 transition">
                                        Secure Upload
                                    </Link>
                                </li> */}
                            </>
                        )}
                    </ul>
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

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden flex flex-col items-center text-center mt-4 space-y-4">
                    <ul className="flex flex-col gap-4 text-white w-full">
                        <li>
                            <Link
                                to="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block w-full hover:text-gray-300 transition"
                            >
                                Gallery
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block w-full hover:text-gray-300 transition"
                            >
                                About
                            </Link>
                        </li>
                        {userRole === "admin" && (
                            <>
                                <li>
                                    <Link
                                        to="/upload-image"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full hover:text-gray-300 transition"
                                    >
                                        Upload Image
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link
                                        to="/upload"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full hover:text-gray-300 transition"
                                    >
                                        Upload
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/secure-upload"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full hover:text-gray-300 transition"
                                    >
                                        Secure Upload
                                    </Link>
                                </li> */}


                            </>
                        )}
                        <li>
                            {token ? (
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate("/auth");
                                    }}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                                >
                                    Login
                                </button>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
