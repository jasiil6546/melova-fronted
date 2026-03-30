"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function CartPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const btnPrimary =
    "block w-full bg-[#9e7c29] text-white text-center py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition";
  const btnGhost =
    "text-red-500 hover:text-red-700 text-xs font-medium transition flex items-center gap-1";
  const qtyBtn =
    "px-2.5 py-1 hover:bg-stone-200 transition text-stone-600 disabled:opacity-40";
  const card =
    "bg-white rounded-2xl shadow-sm border border-gray-100";

  const fetchCart = React.useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get(`/api/shop/cart/`);
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchCart();
    else setLoading(false);
  }, [token, fetchCart]);

  const updateQuantity = async (variantId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await api.post(`/api/shop/cart/update_item/`, { 
        variant_id: variantId, 
        quantity: newQuantity 
      });
      setCart(res.data);
    } catch (err) {
      alert("Failed to update quantity");
    }
  };

  const removeItem = async (variantId) => {
    try {
      const res = await api.post(`/api/shop/cart/remove_item/`, { 
        variant_id: variantId 
      });
      setCart(res.data);
    } catch (err) {
      alert("Failed to remove item");
    }
  };

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
        <h2 className="text-xl font-semibold mb-4">Please login to view your cart</h2>
        <Link
          href="/login?redirect=/cart"
          className="bg-[#9e7c29] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition"
        >
          Login Now
        </Link>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 px-4 text-center">
        <div className="text-5xl mb-5 text-stone-300">
          <i className="fas fa-shopping-bag"></i>
        </div>
        <h2 className="text-xl font-semibold mb-2 text-stone-800">Your bag is empty</h2>
        <p className="text-stone-500 mb-6 max-w-sm text-sm">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/products" className={btnPrimary}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 px-3 py-6 sm:px-4 sm:py-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl">
        <div className="flex flex-row-reverse  justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-stone-900 flex items-center gap-3">
            <i className="fas fa-shopping-bag text-[#9e7c29]"></i>
            Your Bag
          </h1>
          <Link href="/products" className="text-sm font-medium text-stone-500 hover:text-stone-800 flex items-center gap-2 transition">
            <i className="fas fa-arrow-left"></i> Continue Shopping
          </Link>
        </div>
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-3">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className={`${card} p-3 sm:p-4 flex gap-3 items-center`}
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0 relative">
                  <Image
                    src={
                      item.variant_details.images[0]?.image ||
                      "/img/placeholder_product.png"
                    }
                    alt={item.variant_details.name}
                    fill
                    quality={90}
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-800 truncate text-sm">
                    {item.variant_details.name}
                  </h3>
                  <p className="text-stone-500 text-xs mt-1">
                    Size: {item.variant_details.weight}g
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        onClick={() =>
                          updateQuantity(item.variant, item.quantity - 1)
                        }
                        className={qtyBtn}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-xs font-medium text-stone-800 min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.variant, item.quantity + 1)
                        }
                        className={qtyBtn}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.variant)}
                      className={btnGhost}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-stone-900 text-sm">
                    ₹{item.subtotal}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    ₹{item.variant_details.price} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className={`${card} p-4 sm:p-6 sticky top-24`}>
              <h2 className="text-lg font-semibold text-stone-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm mb-5 pb-5 border-b border-stone-100">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">
                    ₹{cart.total_price}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <span className="text-stone-600 text-sm font-medium">Total</span>
                <span className="text-xl font-semibold text-stone-900">
                  ₹{cart.total_price}
                </span>
              </div>

              <Link href="/checkout" className={btnPrimary}>
                Proceed to Checkout
              </Link>

              <div className="mt-5 text-center text-stone-400 text-[11px] font-medium">
                🔒 Secure Checkout
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}