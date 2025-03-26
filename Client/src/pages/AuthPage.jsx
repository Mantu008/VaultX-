import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState(""); // Only for Register
    const navigate = useNavigate();

    const handleAuth = async () => {
        // http://localhost:5000/api/auth/
        try {
            const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
            const payload = isRegister ? { username: userName, email, password } : { email, password };


            const res = await API.post(endpoint, payload);
            if (!isRegister) {
                localStorage.setItem("token", res.data.token);
                navigate("/");
            } else {
                alert("Registration successful! Please log in.");
                setIsRegister(false);
            }
        } catch (error) {
            alert("Authentication failed");
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
                    className="bg-green-500 text-white px-4 py-2 rounded w-full"
                >
                    {isRegister ? "Register" : "Login"}
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
