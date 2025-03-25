import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">VaultX</h1>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/" className="hover:text-gray-300">Home</Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:text-gray-300">About</Link>
                    </li>
                    <li>
                        <Link to="/upload" className="hover:text-gray-300">Upload</Link>
                    </li>
                    <li>
                        <Link to="/secure-upload" className="hover:text-gray-300">Secure Upload</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
