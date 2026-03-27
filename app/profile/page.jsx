"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { RevealWrapper, RevealItem } from "@/components/animations/RevealAnimation";

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile(formData);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <AuthGuard>
      <RevealWrapper className="min-h-screen bg-stone-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-stone-500">
              <li>
                <Link
                  href="/"
                  className="hover:text-amber-800 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-chevron-right text-[10px]"></i>
                <span className="text-stone-800 font-medium">My Profile</span>
              </li>
            </ol>
          </nav>

          {/* Success/Error Alerts */}
          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-100 text-green-700 text-sm flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <RevealItem className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
            {/* Profile Header Background */}
            <div className="h-32 bg-gradient-to-r from-amber-100 to-amber-200"></div>

            <div className="px-8 pb-10 relative">
              {/* Avatar Circle */}
              <div className="absolute -top-12 left-8">
                <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md">
                  <div className="w-full h-full rounded-xl bg-amber-800 flex items-center justify-center text-white text-3xl font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                </div>
              </div>

              <div className="pt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-stone-900">
                    {user.name || "User"}
                  </h1>
                  <p className="text-stone-500 mt-1 flex items-center">
                    <i className="fas fa-envelope mr-2 text-stone-400"></i>
                    {user.email || "No email provided"}
                  </p>
                </div>
                <div className="flex gap-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-all active:scale-95"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-50 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="px-6 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {isEditing ? (
                /* Edit Form */
                <form
                  onSubmit={handleSubmit}
                  className="mt-12 space-y-8 animate-in fade-in duration-500"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h2 className="text-lg font-semibold text-stone-900 flex items-center">
                        <span className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center mr-3 text-stone-500">
                          <i className="fas fa-user-edit text-sm"></i>
                        </span>
                        Edit Details
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-stone-50 rounded-2xl p-6 flex flex-col justify-between border border-stone-100">
                      <div>
                        <h3 className="text-stone-900 font-semibold mb-2">
                          Password Update
                        </h3>
                        <p className="text-sm text-stone-500">
                          To change your password, please use the &quot;Forgot
                          Password&quot; link on the login page or contact support.
                        </p>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-3.5 bg-amber-800 text-white rounded-xl font-semibold hover:bg-amber-900 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
                      >
                        {loading ? (
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                        ) : (
                          <i className="fas fa-save mr-2"></i>
                        )}
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* View Mode */
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                  {/* Account Details */}
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-stone-900 flex items-center">
                      <span className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center mr-3 text-stone-500">
                        <i className="fas fa-id-card text-sm"></i>
                      </span>
                      Personal Information
                    </h2>
                    <div className="space-y-4 px-2">
                      <div>
                        <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                          Full Name
                        </label>
                        <p className="text-stone-800 font-medium">
                          {user.name || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                          Email Address
                        </label>
                        <p className="text-stone-800 font-medium">
                          {user.email || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                          Phone Number
                        </label>
                        <p className="text-stone-800 font-medium">
                          {user.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions / Status */}
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-stone-900 flex items-center">
                      <span className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center mr-3 text-stone-500">
                        <i className="fas fa-shopping-bag text-sm"></i>
                      </span>
                      Account Activity
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                        <p className="text-xs text-stone-500 mb-1">
                          Total Orders
                        </p>
                        <p className="text-xl font-bold text-stone-900">0</p>
                      </div>
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                        <p className="text-xs text-stone-500 mb-1">
                          Saved Items
                        </p>
                        <p className="text-xl font-bold text-stone-900">0</p>
                      </div>
                    </div>
                    <Link
                      href="/orders"
                      className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-900 hover:bg-amber-100 transition-colors group"
                    >
                      <span className="font-semibold">View Order History</span>
                      <i className="fas fa-arrow-right text-sm transform group-hover:translate-x-1 transition-transform"></i>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </RevealItem>

          <RevealItem>
            <p className="text-center text-stone-400 text-sm mt-8">
              Need help?{" "}
            <Link
              href="/contact"
              className="text-amber-800 font-medium hover:underline"
            >
              Contact Support
            </Link>
            </p>
          </RevealItem>
        </div>
      </RevealWrapper>
    </AuthGuard>
  );
}
