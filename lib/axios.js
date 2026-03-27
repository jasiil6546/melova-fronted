import axios from "axios";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/").trim().replace(/\/$/, "");

const isServer = typeof window === "undefined";

const api = axios.create({
  // Always use absolute URL on client and server for maximum stability
  baseURL: API_URL,
});

// Request interceptor — attach access token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("melova_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // DEBUG: Log the actual URL being hit
    if (isServer) {
        console.log(`Axios Server Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    } else {
        console.log(`Axios Client Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh once per request, and only on 401
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;

      const refreshToken = sessionStorage.getItem("melova_refresh");
      if (!refreshToken) {
        // No refresh token — force logout
        _clearSession();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access, refresh } = res.data;

        // Store the new tokens
        sessionStorage.setItem("melova_token", access);
        if (refresh) {
          sessionStorage.setItem("melova_refresh", refresh);
        }

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — force logout
        _clearSession();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

function _clearSession() {
  if (typeof window === "undefined") return;
  
  sessionStorage.removeItem("melova_token");
  sessionStorage.removeItem("melova_refresh");
  sessionStorage.removeItem("melova_role");
  sessionStorage.removeItem("melova_user");
  
  // Redirect to login
  if (window.location.pathname !== "/login" && !window.location.pathname.includes("/admin/login")) {
    window.location.href = "/login";
  }
}

export default api;
