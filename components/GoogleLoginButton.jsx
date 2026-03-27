"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function GoogleLoginButton({ onError, text = "signin_with" }) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const googleInitialized = useRef(false);

  const btnId = useRef(`google-btn-${Math.random().toString(36).substr(2, 9)}`);

  const handleGoogleCredential = async (credential) => {
    if (onError) onError("");
    setGoogleLoading(true);
    try {
      const role = await loginWithGoogle(credential);
      router.push(role === "admin" ? "/admin" : "/");
    } catch (err) {
      const msg = err.response?.data?.error || "Google sign-in failed. Please try again.";
      if (onError) onError(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (googleInitialized.current) return;
    if (!window.google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (response.credential) {
            handleGoogleCredential(response.credential);
          }
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById(btnId.current),
        {
          theme: "outline",
          size: "large",
          shape: "pill",
          width: "100%",
          text: text,
        }
      );

      googleInitialized.current = true;
    } catch (e) {
      console.error("Google Init Error:", e);
    }
  }, [text, onError]);

  return (
    <div className="w-full flex flex-col items-center">
      <div id={btnId.current} className="flex justify-center w-full min-h-[44px]"></div>
      {googleLoading && (
        <p className="text-center text-sm text-gray-500 mt-2">
          {text === "signup_with" ? "Signing up with Google..." : "Signing in with Google..."}
        </p>
      )}
    </div>
  );
}
