import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';


let api = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
})

// Attach token automatically (if available)
api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    console.log("🚀 ~ token:", token)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api;