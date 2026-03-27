import React from "react";
import Link from "next/link";
import { getProducts } from "@/lib/product-data";
import ProductCard from "@/components/ProductCard";
import { RevealWrapper, RevealItem } from "@/components/animations/RevealAnimation";

export const metadata = {
  title: "Our Chocolates Products | MyMelova Chocolate Factory",
  description:
    "MyMelova’s handcrafted chocolate bars made with the finest cocoa. From classic milk chocolate to rich dark blends, our artisanal bars deliver indulgence in every bite.",
};

export default async function Products() {
  const products = await getProducts();

  return (
    <>
      <div className="page-header bg-section parallaxie">
        <RevealWrapper className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="page-header-box">
                <RevealItem>
                  <h1 className="text-anime-style-2" data-cursor="-opaque">
                    Our <span>products</span>
                  </h1>
                </RevealItem>
                <RevealItem className="wow fadeInUp">
                  <nav>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link href="/">home</Link>
                      </li>
                      <li className="bread" aria-current="page">
                        products
                      </li>
                    </ol>
                  </nav>
                </RevealItem>
              </div>
            </div>
          </div>
        </RevealWrapper>
      </div>

      <div className="page-product bg-section">
        <RevealWrapper className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="our-product-box row">
                {products.map((product) => (
                  <RevealItem className="col-lg-3" key={product.id}>
                    <ProductCard product={product} />
                  </RevealItem>
                ))}
              </div>
            </div>
          </div>
        </RevealWrapper>
      </div>
    </>
  );
}
