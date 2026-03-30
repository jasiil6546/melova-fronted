"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";

export default function AdminOrderDetails() {
  const router = useRouter();
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!token || !id) return;

      try {
        const response = await api.get(`/api/shop/orders/${id}/`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, [token, id]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);

    try {
      const response = await api.patch(`/api/shop/orders/${id}/`, { 
        status: newStatus 
      });

      setOrder(response.data);
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount) =>
    "₹" +
    parseFloat(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen leading-relaxed">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto"></div>
          <p className="text-stone-600 font-medium">
            Loading Order Details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-center bg-white rounded-2xl shadow-sm border border-stone-100 max-w-2xl mx-auto mt-20 leading-relaxed">
        <div className="mb-6 text-stone-300">
          <i className="fas fa-file-invoice text-6xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-3">
          Order Not Found
        </h2>
        <p className="text-stone-500 mb-8">
          The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have
          permission to view it.
        </p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center px-6 py-3 bg-amber-800 text-white rounded-xl font-semibold hover:bg-amber-900 transition shadow-lg shadow-amber-900/20"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10 animate-fadeIn leading-relaxed max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link
            href="/admin/orders"
            className="text-amber-800 font-semibold mb-3 inline-flex items-center hover:underline"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Orders List
          </Link>

          <h1 className="text-3xl font-bold text-stone-800 leading-tight">
            Order <span className="text-amber-800">#{order.id}</span>
          </h1>

          <p className="text-stone-500 mt-2">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>

        <div className="flex gap-3">
          <select
            className="px-4 py-2 border border-stone-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition"
            value={order.status || "Pending"}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={updating}
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Paid">Paid</option>
          </select>

          <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20">
            <i className="fas fa-print mr-2"></i>
            Print Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-10">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-7 py-5 border-b border-stone-50 flex items-center justify-between">
              <h2 className="font-bold text-stone-800">Order Items</h2>
              <span className="text-stone-500 text-sm">
                {order.items?.length || 0} Products
              </span>
            </div>

            <div className="divide-y divide-stone-50">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="p-7 flex items-center gap-6 group hover:bg-stone-50 transition"
                >
                  <div className="w-20 h-20 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0 border border-stone-200 relative">
                    <Image
                      src={
                        item.product_image ||
                        "https://placehold.co/100x100?text=No+Image"
                      }
                      alt={item.product_name}
                      fill
                      quality={90}
                      className="object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-stone-800 text-lg">
                      {item.product_name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-stone-500">
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                        Qty: {item.quantity}
                      </span>
                      <span>•</span>
                      <span>Unit Price: {formatCurrency(item.price)}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-bold text-lg text-stone-800">
                      {formatCurrency(item.quantity * item.price)}
                    </div>
                    <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                      Subtotal
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-stone-50 p-7 space-y-4">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium text-stone-800">
                  {formatCurrency(order.total)}
                </span>
              </div>

              <div className="flex justify-between text-stone-600">
                <span>Shipping Fee</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>

              <div className="flex justify-between border-t border-stone-200 pt-4 text-xl font-bold text-stone-800">
                <span>Grand Total</span>
                <span className="text-amber-800">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl">
                <i className="fas fa-credit-card"></i>
              </div>
              <div>
                <p className="text-stone-500 text-sm font-medium uppercase tracking-wider">
                  Payment Status
                </p>
                <p className="font-bold text-stone-800 text-lg">
                  {order.status === "Paid"
                    ? "Successfully Processed"
                    : "Payment Pending"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 text-xl">
                <i className="fas fa-truck"></i>
              </div>
              <div>
                <p className="text-stone-500 text-sm font-medium uppercase tracking-wider">
                  Estimated Delivery
                </p>
                <p className="font-bold text-stone-800 text-lg">
                  3–5 Working Days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7">
            <h2 className="font-bold text-stone-800 mb-5 flex items-center pb-4 border-b border-stone-50">
              <i className="fas fa-user-circle mr-3 text-amber-800 text-xl"></i>
              Customer Information
            </h2>

            <div className="space-y-6">
              <InfoRow icon="fa-user" label="Full Name" value={order.full_name || "Guest Customer"} />
              <InfoRow icon="fa-envelope" label="Email Address" value={order.user_email || "N/A"} />
              <InfoRow icon="fa-phone" label="Contact Number" value={order.phone || "N/A"} />
            </div>
          </div>

          {/* Address */}
          <div className="bg-amber-900/5 rounded-2xl border border-amber-900/10 shadow-sm p-7">
            <h2 className="font-bold text-amber-900 mb-5 flex items-center pb-4 border-b border-amber-900/10">
              <i className="fas fa-map-marker-alt mr-3 text-amber-800 text-xl"></i>
              Shipping Destination
            </h2>

            <div className="bg-white/60 p-5 rounded-xl border border-white/80 space-y-3">
              <p className="text-stone-700 font-medium">
                {order.address || "No address provided"}
              </p>

              <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-amber-800 text-white px-3 py-1 rounded-full font-bold uppercase tracking-tight text-[10px]">
                  {order.city || "City"}
                </span>
                <span className="bg-amber-800 text-white px-3 py-1 rounded-full font-bold uppercase tracking-tight text-[10px]">
                  {order.pincode || "Zip"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p className="text-xs text-stone-400 uppercase font-bold tracking-widest mb-1">
          {label}
        </p>
        <p className="font-bold text-stone-800">{value}</p>
      </div>
    </div>
  );
}