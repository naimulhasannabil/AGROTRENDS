import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

API.interceptors.request.use((req) => {
  // Don't add Authorization header for auth endpoints (sign-in, sign-up)
  const isAuthEndpoint =
    req.url.includes("/api/auth/sign-in") ||
    req.url.includes("/api/auth/sign-up");

  if (!isAuthEndpoint) {
    const token = localStorage.getItem("token");
    console.log("🔑 API Interceptor for:", req.url);
    console.log(
      "   Token in localStorage:",
      token ? "YES (" + token.substring(0, 20) + "...)" : "NO",
    );

    if (token) {
      // set both cases to be safe with different backends
      req.headers.Authorization = `Bearer ${token}`;
      req.headers.authorization = `Bearer ${token}`;
      console.log("   ✓ Authorization header added");
    } else {
      console.warn("   ❌ NO TOKEN FOUND - Request will be anonymous!");
    }
  } else {
    // Explicitly ensure no Authorization header for auth endpoints
    delete req.headers.Authorization;
    console.log("🔓 Auth endpoint (no token needed):", req.url);
  }
  return req;
});

export default API;
// Response interceptor for better error logging
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const req = err.config || {};
    console.error("API response error for:", req.url || "(unknown url)");
    if (err.response) {
      console.error("  status:", err.response.status);
      console.error("  data:", err.response.data);
    } else {
      console.error("  error:", err.message);
    }
    return Promise.reject(err);
  },
);
