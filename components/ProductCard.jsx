import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product, delay = "0.6s" }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="product-item wow fadeInUp" data-wow-delay={delay}>
        <div className="product-image relative h-64">
          <Image
            src={product.image || "/img/product-1.png"}
            alt={product.title || product.name || "Product Image"}
            fill
            quality={90}
            className="object-cover"
          />
        </div>
        <div className="product-item-body">
          <div className="product-rating">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
          </div>
          <div className="product-item-content">
            <h2>{product.title || product.name}</h2>
            {product.price && (
              <p className="product-price">₹{product.price}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
