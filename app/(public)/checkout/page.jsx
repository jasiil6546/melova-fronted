"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [step, setStep] = useState(1);
  const [cart, setCart] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // ✅ Shared clean input style (same as signup)
  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-amber-700 focus:bg-white focus:outline-none transition";

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Load cart + autofill user
  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;
      try {
        const res = await api.get(`/api/shop/cart/`);
        setCart(res.data);
      } catch (err) {
        console.error("Error fetching cart for checkout:", err);
      }
    };

    if (token) {
      fetchCart();
    }

    if (user) {
      const fullName = (user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`).trim();
      const [firstName, ...rest] = fullName ? fullName.split(/\s+/) : [];
      const lastName = rest.join(" ");

      setFormData((p) => ({
        ...p,
        firstName: firstName || "",
        lastName: lastName || "",
        email: user.email || "",
      }));
    }
  }, [user, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const nextStep = () => {
    if (step === 1 && !user) {
      alert("Please login to continue.");
      router.push("/login?redirect=/checkout");
      return;
    }
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const handleSubmitOrder = async () => {
    if (!user || !token) return alert("Login required.");
    if (!cart || cart.items.length === 0) return alert("Cart is empty.");

    setIsProcessing(true);

    try {

      const payload = {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.zipCode,
      };

      const res = await api.post(`/api/shop/cart/checkout/`, payload);

      const razorpayOrderId = res.data.razorpay_order_id;
      const amountInPaise = Math.round(cart.total_price * 100);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: "INR",
        name: "Melova",
        description: "Melova Chocolate Order",
        order_id: razorpayOrderId,
        handler: async (response) => {
          const verifyRes = await api.post(`/api/shop/verify-payment/`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.status === "Payment Successful") {
            window.dispatchEvent(new Event("cartUpdated"));
            setStep(3);
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#92400e" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Order error:", err);
      alert("Order failed. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart && step !== 3) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/products" className="text-amber-800 underline">
          Your cart is empty — Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Back Button */}
        {step !== 3 && (
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-amber-800 transition-colors group"
            >
              <i className="fas fa-arrow-left text-sm group-hover:-translate-x-1 transition-transform"></i>
              <span className="text-sm font-medium">Back to Shopping</span>
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-8">
            {/* STEP 1 */}
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Delivery details
                </h2>

                <div className="space-y-3.5">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      className={inputClass}
                      placeholder="First name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className={inputClass}
                      placeholder="Last name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <input
                    className={inputClass}
                    placeholder="Email address"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />

                  <input
                    className={inputClass}
                    placeholder="Phone number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />

                  <input
                    className={inputClass}
                    placeholder="Street address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />

                  <div className="grid sm:grid-cols-3 gap-3">
                    <input
                      className={inputClass}
                      placeholder="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className={inputClass}
                      placeholder="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className={inputClass}
                      placeholder="ZIP"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-8 w-full rounded-lg bg-amber-800 py-2.5 text-sm font-semibold text-white hover:bg-amber-900 transition"
                >
                  Continue to payment
                </button>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Review & pay
                </h2>

                <div className="text-sm text-gray-600 space-y-1 mb-6">
                  <p className="font-medium text-gray-900">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p>{formData.address}</p>
                  <p>
                    {formData.city}, {formData.state} — {formData.zipCode}
                  </p>
                  <p>{formData.phone}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={prevStep}
                    className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isProcessing}
                    className="flex-1 rounded-lg bg-amber-800 py-2.5 text-sm font-semibold text-white hover:bg-amber-900 disabled:opacity-60"
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Pay ₹${cart.total_price}`}
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="text-center py-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Order confirmed 🎉
                </h2>
                <p className="text-gray-500 mb-6">
                  We’ve received your order and will email you the details.
                </p>
                <Link
                  href="/products"
                  className="inline-block rounded-lg bg-amber-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-900"
                >
                  Continue shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        {step !== 3 && (
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-10">
              <h3 className="font-semibold text-gray-900 mb-5">
                Order summary
              </h3>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 mb-4 items-center">
                    <div className="w-12 h-12 relative flex-shrink-0">
                      <Image
                        src={item.variant_details.images[0]?.image || "/img/placeholder_product.png"}
                        alt={item.variant_details.name}
                        fill
                        quality={90}
                        className="rounded-lg object-cover border border-gray-100"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.variant_details.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x ₹{item.variant_details.price}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ₹{item.subtotal}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{cart.total_price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 pt-3 border-t">
                  <span>Total</span>
                  <span>₹{cart.total_price}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}