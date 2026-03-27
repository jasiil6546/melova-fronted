"use client";
import React, { useEffect, useState, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function AdminDashboard() {
  const { token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [chartData, setChartData] = useState(new Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      if (!token) return;
      
      try {
        const [ordersRes, productsRes] = await Promise.all([
          api.get(`/api/shop/orders/`),
          api.get(`/api/shop/products/`),
        ]);

        const ordersData = ordersRes.data;
        const productsData = productsRes.data;

        const orders = Array.isArray(ordersData)
          ? ordersData
          : ordersData.results || [];

        const products = Array.isArray(productsData)
          ? productsData
          : productsData.results || [];

        // 1. Calculate Stats
        const totalRevenue = orders.reduce(
          (sum, order) => sum + (parseFloat(order.total) || 0),
          0,
        );
        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: products.length,
        });

        // 2. Recent Orders
        setRecentOrders(orders.slice(0, 8));

        // 3. Top Performers (Real Data)
        const productStats = {};
        orders.forEach(order => {
          if (order.items) {
            order.items.forEach(item => {
              const pid = item.product;
              if (!productStats[pid]) {
                productStats[pid] = { sales: 0, revenue: 0, name: item.product_name };
              }
              productStats[pid].sales += item.quantity;
              productStats[pid].revenue += (parseFloat(item.price) * item.quantity);
            });
          }
        });

        console.log(productStats);

        const sortedTop = Object.entries(productStats)
          .map(([id, data]) => ({ id, ...data }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5);
        
        setTopProducts(sortedTop);
        

        // 4. Monthly Revenue for Chart
        const monthlyRevenue = new Array(12).fill(0);
        const currentYear = new Date().getFullYear();
        
        orders.forEach(order => {
          const date = new Date(order.created_at);
          if (date.getFullYear() === currentYear) {
            monthlyRevenue[date.getMonth()] += parseFloat(order.total) || 0;
          }
        });
        setChartData(monthlyRevenue);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  useEffect(() => {
    if (window.Chart && chartRef.current && !window.salesChartInstance) {
      const ctx = chartRef.current.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(158, 124, 41, 0.3)'); /* Gold gradient */
      gradient.addColorStop(1, 'rgba(158, 124, 41, 0)');

      window.salesChartInstance = new window.Chart(chartRef.current, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Revenue (₹)",
              data: chartData,
              borderColor: "#9e7c29",
              backgroundColor: gradient,
              borderWidth: 4,
              pointBackgroundColor: "#562c1b",
              pointBorderColor: "#fff",
              pointHoverRadius: 6,
              tension: 0.45,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#3e1f14",
              titleColor: "#9e7c29",
              bodyColor: "#fff",
              padding: 12,
              cornerRadius: 10,
              displayColors: false
            }
          },
          scales: {
            y: {
              grid: { color: "rgba(86,44,27,0.05)", borderDash: [5, 5] },
              ticks: { color: "#8d736a" }
            },
            x: {
              grid: { display: false },
              ticks: { color: "#8d736a" }
            }
          }
        },
      });
    }

    return () => {
      if (window.salesChartInstance) {
        window.salesChartInstance.destroy();
        window.salesChartInstance = null;
      }
    };
  }, [loading, chartData]);

  const formatCurrency = (amount) => {
    return "₹" + parseFloat(amount).toLocaleString("en-IN");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
  <div className="p-6 space-y-6">

    {/* Welcome */}
    <div>
      <h2 className="text-2xl font-bold">Store Overview</h2>
      <p className="text-gray-500">
        Welcome back. Monitoring your chocolate empire&apos;s performance.
      </p>
    </div>

    {/* Stats */}
<div className="grid md:grid-cols-3 gap-4">
  {/* Orders */}
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
      <i className="fas fa-shopping-bag text-blue-600 text-lg"></i>
    </div>
    <div>
      <h3 className="text-xl font-semibold">
        {loading ? "..." : stats.totalOrders}
      </h3>
      <p className="text-gray-500 text-sm">Total Orders</p>
    </div>
  </div>

  {/* Revenue */}
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
    <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
      <i className="fas fa-rupee-sign text-emerald-600 text-lg"></i>
    </div>
    <div>
      <h3 className="text-xl font-semibold">
        {loading ? "..." : formatCurrency(stats.totalRevenue)}
      </h3>
      <p className="text-gray-500 text-sm">Total Revenue</p>
    </div>
  </div>

  {/* Products */}
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
    <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
      <i className="fas fa-box text-amber-600 text-lg"></i>
    </div>
    <div>
      <h3 className="text-xl font-semibold">
        {loading ? "..." : stats.totalProducts}
      </h3>
      <p className="text-gray-500 text-sm">Total Products</p>
    </div>
  </div>
</div>

    {/* Main Grid */}
    <div className="grid lg:grid-cols-12 gap-6">

      {/* Revenue Chart */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold">Revenue Analytics</h3>
          <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
            Live Analysis
          </span>
        </div>
        <div className="p-4 h-[350px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      {/* Top Products */}
      <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold">Top Performers</h3>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
            ))
          ) : topProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No product data available
            </p>
          ) : (
            topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-500">
                    {product.sales} sales •{" "}
                    <span className="font-medium text-amber-600">
                      {formatCurrency(product.revenue)}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="lg:col-span-12 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold">Recent Orders</h3>
          <button 
            onClick={() => router.push("/admin/orders")}
            className="text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
          >
            Manage Orders
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left px-4 py-2 font-semibold">Order ID</th>
                <th className="text-left px-4 py-2 font-semibold">Customer</th>
                <th className="text-left px-4 py-2 font-semibold">Amount</th>
                <th className="text-left px-4 py-2 font-semibold">Date</th>
                <th className="text-left px-4 py-2 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="5" className="px-4 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                  >
                    <td className="px-4 py-3 font-semibold text-stone-700">
                      #ORD-{order.id}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {order.full_name || order.customer?.name || "Guest Customer"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-amber-700">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        order.status === "Paid" ? "bg-emerald-100 text-emerald-700" :
                        order.status === "Pending" ? "bg-amber-100 text-amber-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {order.status || "Processed"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
);
}
