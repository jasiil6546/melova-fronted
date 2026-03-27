"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function AdminOrders() {
  const router = useRouter();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      if (!token) return;
      try {
        const response = await api.get(`/api/shop/orders/`);
        const data = response.data;
        const ordersArray = Array.isArray(data) ? data : data.results || [];
        setOrders(ordersArray);
        setFilteredOrders(ordersArray);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [token]);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      // Admin might want to search by full name, email, or order ID
      const customerName = (order.full_name || order.user_email || "").toLowerCase();
      const orderIdStr = String(order.id);

      const matchesSearch =
        customerName.includes(searchTerm.toLowerCase()) ||
        orderIdStr.includes(searchTerm.toLowerCase());

      const status = order.status || "";
      const matchesStatus = statusFilter === "" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
  };

  const formatCurrency = (amount) => {
    return (
      "₹" +
      parseFloat(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const deleteOrder = async (id) => {
  const confirmDelete = confirm(`Are you sure you want to delete Order #${id}?`);
  if (!confirmDelete) return;

  try {
    const response = await api.delete(`/api/shop/orders/${id}/`);

    if (response.status === 204 || (response.status >= 200 && response.status < 300)) {
    // Remove deleted order from state (instant UI update)
    const updatedOrders = orders.filter((order) => order.id !== id);
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);

    alert("Order deleted successfully");
    } else {
        throw new Error("Failed to delete");
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert("Failed to delete order");
  }
};

  const viewOrder = (id) => {
    router.push(`/admin/orders/${id}`);
  };
  const printInvoice = (id) => alert(`Printing invoice for Order #${id}`);

 return (
  <div className="p-6 space-y-6">

    {/* Search & Filters */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="grid md:grid-cols-12 gap-3 items-center">

        {/* Search */}
        <div className="md:col-span-6 relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Search orders by customer name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Reset */}
        <div className="md:col-span-3">
          <button
            onClick={resetFilters}
            className="w-full border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50"
          >
            <i className="fas fa-rotate-right mr-2"></i>
            Reset Filters
          </button>
        </div>

      </div>
    </div>

    {/* Orders Table */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="font-semibold">
          All Orders
          <span className="text-gray-500 font-normal ml-2">
            ({filteredOrders.length})
          </span>
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left px-4 py-2 font-semibold">Order ID</th>
              <th className="text-left px-4 py-2 font-semibold">Customer</th>
              <th className="text-left px-4 py-2 font-semibold">Email</th>
              <th className="text-left px-4 py-2 font-semibold">Total Amount</th>
              <th className="text-left px-4 py-2 font-semibold">Order Date</th>
              <th className="text-left px-4 py-2 font-semibold">Status</th>
              <th className="text-center px-4 py-2 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  
                  <td className="px-4 py-2 font-semibold">
                    #{order.id}
                  </td>

                  <td className="px-4 py-2">
                    <span className="font-medium">
                      {order.full_name || "N/A"}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-gray-600">
                    {order.user_email || "N/A"}
                  </td>

                  <td className="px-4 py-2 font-semibold text-amber-700">
                    {formatCurrency(order.total)}
                  </td>

                  <td className="px-4 py-2 text-gray-600">
                    {formatDate(order.created_at)}
                  </td>

                  <td className="px-4 py-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      order.status === "Paid" ? "bg-emerald-100 text-emerald-700" :
                      order.status === "Pending" ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status || "Pending"}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => viewOrder(order.id)}
                        title="View Details"
                        className="px-2 py-1 text-xs font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600"
                      >
                        <i className="fas fa-eye"></i>
                      </button>

                      <button
                        onClick={() => printInvoice(order.id)}
                        title="Print Invoice"
                        className="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                      >
                        <i className="fas fa-print"></i>
                      </button>

                      <button
                        onClick={() => deleteOrder(order.id)}
                        title="Delete Order"
                        className="px-2 py-1 text-xs font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>

  </div>
);
}
