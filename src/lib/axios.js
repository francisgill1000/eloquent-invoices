import axios from "axios";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

console.log("🚀 ~ API_BASE:", API_BASE)

let api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token and user_id automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // ✅ Add token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Always add user_id as request parameter (query param)
    if (user?.id) {
      config.params = { ...(config.params || {}), user_id: user.id };
    }
  }

  return config;
});

export const API_BASE_URL = API_BASE;

export default api;
