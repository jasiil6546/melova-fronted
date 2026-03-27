"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("melova_user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [role, setRole] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("melova_role");
    }
    return null;
  });
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("melova_token");
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth state is already loaded from localStorage via lazy init above.
    // Mark loading as complete so guards can render.
    setLoading(false);
  }, []);

  const handleAuthSuccess = (authPayload) => {
    // Response can be { "access": "...", "refresh": "...", "user": { ... } }
    // OR { "token": "...", "user": { ... } }
    const accessToken = authPayload.access || authPayload.token;
    const { refresh, user } = authPayload;

    if (!accessToken) {
        console.error("No access token found in auth payload:", authPayload);
        return null;
    }

    const userRole = user?.is_superuser ? "superadmin" : user?.is_staff ? "admin" : "user";

    setToken(accessToken);
    setRole(userRole);
    setUser(user);

    localStorage.setItem("melova_token", accessToken);
    if (refresh) localStorage.setItem("melova_refresh", refresh);
    localStorage.setItem("melova_role", userRole);
    localStorage.setItem("melova_user", JSON.stringify(user));

    return userRole;
  };

  const login = async (email, password) => {
    // Standardize login payload based on backend required fields (email, password)
    const res = await api.post("/api/auth/login/", { 
      email, 
      password 
    });
    return handleAuthSuccess(res.data);
  };

  const register = async (payload) => {
    // Add username as a fallback during registration
    const data = { ...payload, username: payload.email };
    const res = await api.post("/api/auth/register/", data);
    return handleAuthSuccess(res.data);
  };

  const loginWithGoogle = async (googleIdToken) => {
    try {
      const res = await api.post("/api/auth/google/", {
        id_token: googleIdToken,
      });
      return handleAuthSuccess(res.data);
    } catch (err) {
      console.error("Google Login Error:", err.response?.data || err.message);
      throw err;
    }
  };

  const updateProfile = async (payload) => {
    const res = await api.patch("/api/auth/me/", payload); 

    // UserProfileView returns the user object directly on PATCH,
    // wrapped in { user: ... } only when using retrieve.
    const updatedUser = res.data.user || res.data;
    setUser(updatedUser);
    localStorage.setItem("melova_user", JSON.stringify(updatedUser));
    return updatedUser;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("melova_refresh");

    if (refreshToken) {
      try {
        await api.post("/api/auth/logout/", { refresh: refreshToken });
      } catch (err) {
        console.error("Logout error:", err);
      }
    }

    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem("melova_token");
    localStorage.removeItem("melova_refresh");
    localStorage.removeItem("melova_role");
    localStorage.removeItem("melova_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
