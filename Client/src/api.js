import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_REACT_BACKEND_APP_API_URL, // Ensure this is set correctly
});

export default API;
