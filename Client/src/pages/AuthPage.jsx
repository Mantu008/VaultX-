import { useState, useContext } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { MediaContext } from "../context/MediaContext";
import { toast } from "react-toastify";  // Import toast for notifications

const AuthPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState(""); // Only for Register
    const [loading, setLoading] = useState(false);
    const { setIsAuthenticated } = useContext(MediaContext);
    const navigate = useNavigate();

    const handleAuth = async () => {
        setLoading(true);
        try {
            const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
            const payload = isRegister ? { username: userName, email, password } : { email, password };

            const res = await API.post(endpoint, payload);

            if (!isRegister) {
                localStorage.setItem("token", res.data.token);
                setIsAuthenticated(true); // Update auth status globally
                toast.success("Login successful!");
                navigate("/");
            } else {
                toast.success("Registration successful! Please log in.");
                setIsRegister(false);
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Authentication failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4">{isRegister ? "Register" : "Login"}</h1>

                {isRegister && (
                    <input
                        type="text"
                        placeholder="User Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="border p-2 w-full mb-2"
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full mb-2"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full mb-4"
                />

                <button
                    onClick={handleAuth}
                    disabled={loading}
                    className={`bg-green-500 text-white px-4 py-2 rounded w-full ${loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "Processing..." : isRegister ? "Register" : "Login"}
                </button>

                <p className="text-center mt-4">
                    {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button className="text-blue-500" onClick={() => setIsRegister(!isRegister)}>
                        {isRegister ? "Login" : "Register"}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
