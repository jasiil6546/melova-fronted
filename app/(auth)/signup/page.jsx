"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../../../context/AuthContext";
import GoogleLoginButton from "../../../components/GoogleLoginButton";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, register, loading: authLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!authLoading && user) router.push("/");
  }, [user, authLoading, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      let strength = 0;
      if (value.length >= 6) strength++;
      if (value.length >= 10) strength++;
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;
      if (/\d/.test(value)) strength++;
      if (/[^a-zA-Z\d]/.test(value)) strength++;
      if (strength <= 2) setPasswordStrength("weak");
      else if (strength <= 4) setPasswordStrength("medium");
      else setPasswordStrength("strong");
      if (value.length === 0) setPasswordStrength("");
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);
  try {
    const payload = {
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      password: formData.password,
      password2: formData.confirmPassword,   // ← backend expects "password2"
    };
     
    const role = await register(payload);
    router.push(role === "admin" ? "/admin/dashboard" : "/");
  } catch (err) {
    const data = err.response?.data;
    setError(
      data
        ? Object.values(data).flat().join(" ")
        : "Registration failed. Please try again.",
    );
  } finally {
    setLoading(false);
  }
};



  const strengthBar = {
    weak: "w-1/3 bg-red-400",
    medium: "w-2/3 bg-yellow-400",
    strong: "w-full bg-green-500",
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-amber-700 focus:bg-white focus:outline-none transition";

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <Image
              src="/img/melova_logo.png"
              alt="MyMelova"
              width={64}
              height={64}
              quality={90}
              className="w-16 mx-auto mb-4"
              priority
            />
            <h1 className="text-2xl font-semibold text-gray-900">
              Create account
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Start your chocolate journey today
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <input
                className={inputClass}
                type="text"
                name="firstName"
                placeholder="First name"
                required
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <input
                className={inputClass}
                type="text"
                name="lastName"
                placeholder="Last name"
                required
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>

            <input
              className={inputClass}
              type="email"
              name="email"
              placeholder="Email address"
              required
              value={formData.email}
              onChange={handleInputChange}
            />

            <input
              className={inputClass}
              type="tel"
              name="phone"
              placeholder="Phone number"
              required
              value={formData.phone}
              onChange={handleInputChange}
            />

            {/* Password + strength bar */}
            <div>
              <input
                className={inputClass}
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
              {passwordStrength && (
                <div className="mt-1.5 h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strengthBar[passwordStrength]}`}
                  />
                </div>
              )}
            </div>

            <input
              className={inputClass}
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-amber-800 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-900 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">or</span>
            </div>
          </div>

          {/* Google */}
          <GoogleLoginButton onError={setError} text="signup_with" />

          {/* Footer links */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-amber-800 hover:text-amber-900 transition"
            >
              Log in
            </Link>
          </p>
          <p className="mt-2 text-center text-sm">
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-500 transition"
            >
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
