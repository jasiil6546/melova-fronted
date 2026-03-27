import React from "react";
import Link from "next/link";
import { getProducts } from "@/lib/product-data";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import ProductsScroll from "@/components/ProductsScroll";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const products = await getProducts();
  const product = products.find((p) => p.id === parseInt(resolvedParams.id));

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.title || product.name} | MyMelova Chocolate Factory`,
    description: product.introduction || product.intro,
  };
}

export default async function ProductDetailsPage({ params }) {
  const resolvedParams = await params;
  const products = await getProducts();
  const product = products.find((p) => p.id === parseInt(resolvedParams.id));

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-4">Product not found</h2>
        <Link href="/products" className="btn-default">
          Go Back
        </Link>
      </div>
    );
  }

  // Filter related products (same category/type if available, otherwise just other products)
  // For now, let's just show other products excluding the current one
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 8);

  return (
    <div className="product-details-page bg-section">
      <div className="container">
        <div className="row">
          <ProductDetailsClient product={product} />
        </div>                  

        {relatedProducts.length > 0 && (
          <div className="related-products mt-5 pt-5 border-top">
            <div className="row section-row mb-4">
              <div className="col-lg-12">
                <div className="section-title mb-0">
                  <h3 className="wow fadeInUp">More to love</h3>
                  <h2 className="text-anime-style-2" data-cursor="-opaque">
                    Related Products
                  </h2>
                </div>
              </div>
            </div>
            <div className="row">
              <ProductsScroll products={relatedProducts} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
