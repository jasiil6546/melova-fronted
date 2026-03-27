import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RevealWrapper, RevealItem } from "@/components/animations/RevealAnimation";

export const metadata = {
  title: "Melova | Where to Buy",
};

export default function BuyNow() {
  return (
    <>
      <div className="page-header bg-section parallaxie">
        <RevealWrapper className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <div className="page-header-box">
                <RevealItem>
                  <h1 className="text-anime-style-2" data-cursor="-opaque">
                    <span>Where to</span> Buy
                  </h1>
                </RevealItem>
                <RevealItem className="wow fadeInUp">
                  <nav>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link href="/">home</Link>
                      </li>
                      <li className="bread" aria-current="page">
                        Where to Buy
                      </li>
                    </ol>
                  </nav>
                </RevealItem>
              </div>
            </div>
          </div>
        </RevealWrapper>
      </div>

      <div className="our-products bg-section">
        <RevealWrapper className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              <div className="section-title section-title-center">
                <RevealItem>
                  <h3 className="wow fadeInUp">Where to Buy</h3>
                </RevealItem>
                <RevealItem>
                  <h2 className="text-anime-style-2" data-cursor="-opaque">
                    <span>Buy our Chocolates from our </span> Official Store
                  </h2>
                </RevealItem>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 col-md-12">
              <RevealItem className="product-item wow fadeInUp">
                <div>
                  <figure className="image-anime relative h-64">
                    <Image src="/img/hawocart.png" alt="Hawocart" fill quality={90} className="object-contain" />
                  </figure>
                </div>
                <div className="product-item-content">
                  <h3 style={{ textDecoration: "underline" }}>Buy Now</h3>
                </div>
              </RevealItem>
            </div>
          </div>
        </RevealWrapper>
      </div>
    </>
  );
}
