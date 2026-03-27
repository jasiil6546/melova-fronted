"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function ProductDetailsClient({ product }) {
  const router = useRouter();
  const { token } = useAuth();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const variants = product.variants || [];
  const selectedVariant =
    variants.length > 0 ? variants[selectedVariantIndex] : null;

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

  // ✅ API image handling
  const currentImages =
    selectedVariant?.images?.length
      ? selectedVariant.images.map((img) => img.image)
      : product.image
        ? [product.image]
        : ["/placeholder.png"];

  // ✅ Auto-slide
  useEffect(() => {
    if (currentImages.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) =>
        prev === currentImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [currentImages, isHovered]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.pageX - startX;
    setScrollX(diff);
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    const threshold = 80; // drag distance to change slide
    if (scrollX > threshold && activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    } else if (
      scrollX < -threshold &&
      activeImageIndex < currentImages.length - 1
    ) {
      setActiveImageIndex(activeImageIndex + 1);
    }

    setScrollX(0);
  };

  const handleAddToCart = async (e, silent = false) => {
    if (e) e.preventDefault();

    if (!token) {
      alert("Please login to add items to cart.");
      router.push("/login?redirect=" + window.location.pathname);
      return false;
    }

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";

      await api.post(`/api/shop/cart/add_item/`, { 
        variant_id: selectedVariant.id, 
        quantity: 1 
      });

      window.dispatchEvent(new Event("cartUpdated"));
      if (!silent) alert("Added to cart!");
      return true;
    } catch (err) {
      console.error("Error adding to cart:", err);
      if (!silent) alert("Failed to add to cart.");
      return false;
    }
  };

  const handleOrderNow = async (e) => {
    if (e) e.preventDefault();
    const added = await handleAddToCart(null, true);
    if (added) router.push("/cart");
  };

  return (
    <>
      {/* Product Images */}
      <div className="col-lg-6 mb-4">
        <div
          className="product-details-image wow fadeInUp"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            style={{
              overflow: "hidden",
              position: "relative",
              borderRadius: "15px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
              background: "#fff",
            }}
          >
            {/* Slides */}
            <div
              style={{
                display: "flex",
                transition: isDragging ? "none" : "transform 0.4s ease",
                transform: `translateX(calc(-${activeImageIndex * 100}% + ${scrollX}px))`,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {currentImages.map((img, i) => (
                <a 
                  key={i} 
                  href={img} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ flex: "0 0 100%", minWidth: "100%", display: "block" }}
                >
                  <Image
                    draggable={false}
                    src={img}
                    alt={`${product.title || product.name} image ${i + 1}`}
                    width={1000}
                    height={1000}
                    quality={95}
                    priority={i === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    style={{
                      width: "100%",
                      height: "auto",
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      cursor: "zoom-in",
                    }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Dots */}
          {currentImages.length > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginTop: "14px",
              }}
            >
              {currentImages.map((_, i) => (
                <span
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    transition: "background 0.3s",
                    background: i === activeImageIndex ? "#000" : "#ccc",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="col-lg-6">
        <div className="product-details-content wow fadeInUp">
          <h1 className="text-anime-style-2">
            {product.title || product.name}
          </h1>

          <div className="product-price mt-3 mb-3">
            <h3 className="text-primary">
              Starting from ₹{currentPrice}
            </h3>
          </div>

          <div className="product-description mb-4">
            <p className="lead">
              {product.introduction || product.intro}
            </p>
            <p>{product.details || product.description}</p>
          </div>

          {/* Variants */}
          {variants.length > 0 && (
            <div className="product-variants mb-4">
              <h5>Available Sizes:</h5>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    className={`btn btn-outline-dark ${index === selectedVariantIndex
                        ? "active bg-dark text-white"
                        : ""
                      }`}
                    onClick={() => {
                      setSelectedVariantIndex(index);
                      setActiveImageIndex(0);
                    }}
                  >
                    {variant.name} - {variant.weight}g
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="product-actions mt-5 d-flex flex-wrap gap-3">
            <button className="btn-default" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button
              className="btn-default bg-dark text-white border-0"
              onClick={handleOrderNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}