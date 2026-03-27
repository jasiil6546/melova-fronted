"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function MyOrdersPage() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = React.useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get(`/api/shop/orders/my_orders/`);
      // Sort orders by newest first
      const sortedOrders = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchOrders();
    else setLoading(false);
  }, [token, fetchOrders]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#9e7c29]"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4">
        <h2 className="text-xl font-semibold mb-4 text-stone-800">Please login to view your orders</h2>
        <Link
          href="/login?redirect=/orders"
          className="bg-[#9e7c29] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition shadow-lg"
        >
          Login Now
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <div className="text-6xl mb-5 text-stone-300 drop-shadow-sm">
          <i className="fas fa-box-open"></i>
        </div>
        <h2 className="text-2xl font-semibold mb-3 text-stone-800 tracking-tight">No orders yet</h2>
        <p className="text-stone-500 mb-8 max-w-sm text-sm">
          You haven&apos;t placed any orders. Discover our exquisite selection of premium chocolates and place your first order.
        </p>
        <Link 
          href="/products" 
          className="bg-[#9e7c29] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 sm:px-6 sm:py-12 mt-16 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-3">
            <i className="fas fa-shopping-bag text-[#9e7c29]"></i>
            My Orders
          </h1>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:border-[#9e7c29]/30 transition-colors"
            >
              {/* Order Header */}
              <div className="bg-stone-50 px-4 py-4 sm:px-6 flex flex-wrap justify-between items-center gap-4 border-b border-stone-100">
                <div className="flex flex-wrap gap-x-8 gap-y-2">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-0.5">Order Placed</p>
                    <p className="text-sm text-stone-800 font-medium">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-0.5">Total Amount</p>
                    <p className="text-sm text-stone-800 font-medium">₹{order.total}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-0.5">Order ID</p>
                    <p className="text-xs font-mono text-stone-600 bg-stone-200/50 px-2 py-0.5 rounded-md">
                      #{order.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                      order.status === "Paid"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : order.status === "Pending"
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-stone-100 text-stone-600 border border-stone-200"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 sm:p-6 divide-y divide-stone-50">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row gap-4 sm:items-center first:pt-0 last:pb-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0 border border-stone-50">
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <i className="fas fa-box text-2xl"></i>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-stone-900 leading-tight">
                            {item.product_name}
                          </h3>
                          <p className="text-sm text-stone-500 mt-1">
                            Variant: <span className="font-medium text-stone-700">{item.variant_name}</span>
                          </p>
                        </div>
                        <div className="text-left sm:text-right mt-2 sm:mt-0">
                          <p className="text-base font-bold text-stone-900">
                            ₹{item.price_at_purchase}
                          </p>
                          <p className="text-xs font-medium text-stone-500">
                            Qty: <span className="text-stone-700">{item.quantity}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Shipping Address Footer */}
              <div className="bg-stone-50/50 px-4 py-3 sm:px-6 border-t border-stone-100 text-sm">
                <div className="flex items-start gap-2 text-stone-600">
                  <i className="fas fa-map-marker-alt mt-1 text-stone-400"></i>
                  <div>
                    <span className="font-medium text-stone-800 shrink-0">Delivery to: </span>
                    {order.address}, {order.city}, {order.state} {order.pincode}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
