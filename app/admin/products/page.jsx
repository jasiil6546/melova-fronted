"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/product-data";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        // Attempt to load using our shared data fetching logic
        const data = await getProducts();
        console.log("All products:", data);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products locally:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products.filter((product) => {
      const name = (product.name || "").toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    });

    if (sortOption) {
      filtered = [...filtered].sort((a, b) => {
        let aValue, bValue;
        switch (sortOption) {
          case "name-asc":
            return (a.name || "").localeCompare(b.name || "");
          case "name-desc":
            return (b.name || "").localeCompare(a.name || "");
          case "price-asc":
            aValue = parseFloat(a.price || 0);
            bValue = parseFloat(b.price || 0);
            return aValue - bValue;
          case "price-desc":
            aValue = parseFloat(a.price || 0);
            bValue = parseFloat(b.price || 0);
            return bValue - aValue;
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [searchTerm, sortOption, products]);

  const resetFilters = () => {
    setSearchTerm("");
    setSortOption("");
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

  const viewProduct = (id) => {
    window.location.href = `/products/${id}`;
  };

  const editProduct = (id) => {
    window.location.href = `/admin/edit-product/${id}`;
  };

  const deleteProduct = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${name}"?\n\nThis action cannot be undone.`,
      )
    ) {
      try {
        const res = await api.delete(`/api/shop/products/${id}/`);

        if (res.status === 204 || (res.status >= 200 && res.status < 300)) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
          console.log(`Product ${id} deleted successfully.`);
        } else {
          try {
            const errorData = await res.json();
            alert(`Delete failed: ${JSON.stringify(errorData)}`);
          } catch (e) {
            alert(`Delete failed with status: ${res.status}`);
          }
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("An error occurred while deleting the product.");
      }
    }
  };

  return (
    <div className="admin-content">
      {/* Header Extension for Add Product */}
      <div className="d-flex justify-content-end mb-4">
        {/* We can route to a new component eventually for adding products */}
        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = "/admin/add-product")}
        >
          <i className="fas fa-plus me-2"></i> Add New Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="admin-card mb-4 p-3">
        <div className="card-body p-2">
          <div className="row g-2 align-items-center">

            {/* Search */}
            <div className="col-md-6">
              <div className="position-relative">
                <i className="fas fa-search search-icon absolute transform translate-y-2/3 left-3"></i>
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Sort */}
            <div className="col-md-3">
              <select
                className="form-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sort by...</option>
                <option value="name-asc">Name (A–Z)</option>
                <option value="name-desc">Name (Z–A)</option>
                <option value="price-asc">Price (Low → High)</option>
                <option value="price-desc">Price (High → Low)</option>
              </select>
            </div>

            {/* Reset */}
            <div className="col-md-3">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={resetFilters}
              >
                <i className="fas fa-redo me-2"></i>
                Reset
              </button>
            </div>

          </div>
        </div>
      </div>
      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 p-3">

        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-lg font-semibold">
            All Products
            <span className="text-gray-500 font-normal ml-2">
              ({filteredProducts.length})
            </span>
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* Head */}
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left px-3 py-2 font-semibold">ID</th>
                <th className="text-left px-3 py-2 font-semibold">Image</th>
                <th className="text-left px-3 py-2 font-semibold">Product Name</th>
                <th className="text-left px-3 py-2 font-semibold">Description</th>
                <th className="text-left px-3 py-2 font-semibold">Price</th>
                <th className="text-left px-3 py-2 font-semibold">Variants</th>
                <th className="text-center px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">

                    {/* ID */}
                    <td className="px-3 py-2 font-medium">{product.id}</td>

                    <td className="px-3 py-2 leading-none">
                      <Link 
                        href={`/admin/edit-product/${product.id}`}
                        className="block w-12 h-12 rounded-lg overflow-hidden bg-gray-100 relative hover:ring-2 hover:ring-sky-400 hover:ring-offset-2 transition-all duration-200 shadow-sm"
                        title="Edit Product"
                      >
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.title || "product image"}
                            fill
                            quality={90}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1 font-medium bg-gray-100">
                            N/A
                          </div>
                        )}
                      </Link>
                    </td>

                    {/* Name */}
                    <td className="px-3 py-2">
                      <p className="font-semibold">{product.name}</p>
                    </td>

                    {/* Description */}
                    <td className="px-3 py-2 max-w-[240px]">
                      <p className="text-gray-600">
                        {product.intro && product.intro.length > 60
                          ? `${product.intro.substring(0, 60)}...`
                          : product.intro}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="px-3 py-2 font-semibold">
                      {formatCurrency(
                        product.variants?.[0]?.price ?? product.price
                      )}
                    </td>

                    {/* Variants */}
                    <td className="px-3 py-2">
                      {product.variants ? product.variants.length : 0}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => viewProduct(product.id)}
                          title="View"
                          className="px-2 py-1 text-xs font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600"
                        >
                          View
                        </button>

                        <button
                          onClick={() => editProduct(product.id)}
                          title="Edit"
                          className="px-2 py-1 text-xs font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteProduct(product.id, product.title)}
                          title="Delete"
                          className="px-2 py-1 text-xs font-medium text-white bg-rose-500 rounded-md hover:bg-rose-600"
                        >
                          Delete
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
