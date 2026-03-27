
 "use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import AdminGuard from "@/components/AdminGuard";
import "./admin-style.css";



export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const toggleSidebar = () => {
    document.querySelector(".admin-sidebar").classList.toggle("active");
  };

  return (
    <AdminGuard>
      <div className="admin-wrapper">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <Link href="/" className="sidebar-logo">
              <Image
                src="/img/melova_logo.png"
                alt="MyMelova Admin"
                width={120}
                height={40}
                quality={90}
                style={{ maxWidth: "120px", height: "auto" }}
                priority
              />
            </Link>
          </div>
          <nav className="sidebar-nav">
            <Link href="/admin" className="nav-link">
              <i className="fas fa-chart-pie"></i>
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/products" className="nav-link">
              <i className="fas fa-boxes"></i>
              <span>Products</span>
            </Link>
            <Link href="/admin/orders" className="nav-link">
              <i className="fas fa-shopping-bag"></i>
              <span>Orders</span>
            </Link>
            <Link href="/admin/customers" className="nav-link">
              <i className="fas fa-user-friends"></i>
              <span>Customers</span>
            </Link>
            <div className="nav-divider" style={{ margin: "1rem 0", borderTop: "1px solid var(--glass-border)" }}></div>
            <Link href="/" className="nav-link">
              <i className="fas fa-external-link-alt"></i>
              <span>View Store</span>
            </Link>
            <button 
              onClick={handleLogout} 
              className="nav-link" 
              style={{ background: "none", border: "none", width: "100%", cursor: "pointer", color: "var(--admin-accent)" }}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Header */}
          <header className="admin-header">
            <div className="header-left">
              <button className="mobile-toggle" onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
              </button>
              <h1>Management System</h1>
            </div>
            <div className="header-right">
              <div className="admin-user">
                <i className="fas fa-user-shield"></i>
                <span style={{ fontWeight: 600 }}>{user?.name || "Administrator"}</span>
              </div>
            </div>
          </header>

          {/* Dynamic Content */}
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
