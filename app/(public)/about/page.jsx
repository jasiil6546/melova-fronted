import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RevealWrapper, RevealItem } from "@/components/animations/RevealAnimation";

export const metadata = {
  title: "Our Story - MyMelova | Crafted Premium Chocolates in UAE",
  description:
    "At MyMelova, we crafted premium chocolates that delight the senses. Discover our journey, passion for quality, and dedication to bringing the finest chocolate experiences to chocolate lovers in the UAE.",
};

export default function About() {
  return (
    <>
      {/* Page Header Start */}
      <div
        className="page-header bg-section parallaxie"
        style={{ background: "url('/img/banner.png')" }}
      >
        <RevealWrapper className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              {/* Page Header Box Start */}
              <div className="page-header-box">
                <RevealItem>
                  <h1 className="text-anime-style-2" data-cursor="-opaque">
                    About <span>us</span>
                  </h1>
                </RevealItem>
                <RevealItem className="wow fadeInUp">
                  <nav>
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link href="/">home</Link>
                      </li>
                      <li className="bread" aria-current="page">
                        About us
                      </li>
                    </ol>
                  </nav>
                </RevealItem>
              </div>
              {/* Page Header Box End */}
            </div>
          </div>
        </RevealWrapper>
      </div>
      {/* Page Header End */}

      {/* Our Approach Section Start */}
      <div className="our-approach bg-section">
        <RevealWrapper className="container">
          <div className="row section-row">
            <div className="col-lg-12">
              {/* Section Title Start */}
              <div className="section-title section-title-center">
                <RevealItem>
                  <h3 className="wow fadeInUp">Our Approach</h3>
                </RevealItem>
                <RevealItem>
                  <h2 className="text-anime-style-2" data-cursor="-opaque">
                    Creating chocolate experiences that stay in memory.
                  </h2>
                </RevealItem>
              </div>
              {/* Section Title End */}
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-6">
              {/* Approach Image Start */}
              <div className="approach-image">
                <RevealItem className="approach-img relative h-[450px]">
                  <figure className="image-anime h-full">
                    <Image src="/img/about.png" alt="About Melova" fill quality={90} className="object-cover" />
                  </figure>
                </RevealItem>

                {/* Google Rating Box Start */}
                <RevealItem
                  className="google-rating-box approach-review-box wow fadeInUp"
                  data-wow-delay="0.2s"
                >
                  <div className="google-rating-header">
                    <div className="google-rating-content">
                      <p>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </p>
                      <p>Loved by 1K+ Chocolate Enthusiasts</p>
                    </div>
                  </div>
                </RevealItem>
                {/* Google Rating Box End */}
              </div>
              {/* Approach Image End */}
            </div>
            <div className="col-lg-6">
              {/* Approach Content Start */}
              <div className="appraoch-content">
                <RevealItem className="mission-vision-item wow fadeInUp">
                  <div className="mission-vision-header">
                    <div className="icon-box">
                      <Image src="/images/icon-mission.svg" alt="Mission Icon" width={50} height={50} quality={90} />
                    </div>
                    <div className="mission-vision-title">
                      <h3>our mission</h3>
                    </div>
                  </div>
                  <div className="mission-vision-content">
                    <p>
                      To craft premium chocolates that transform everyday
                      moments into sweet experiences. We combine precision,
                      passion, and innovation to ensure every Melova creation
                      delights the senses and brings joy to our customers.
                    </p>
                  </div>
                </RevealItem>

                <RevealItem
                  className="mission-vision-item wow fadeInUp"
                  data-wow-delay="0.2s"
                >
                  <div className="mission-vision-header">
                    <div className="icon-box">
                      <Image src="/images/icon-vision.svg" alt="Vision Icon" width={50} height={50} quality={90} />
                    </div>
                    <div className="mission-vision-title">
                      <h3>our vision</h3>
                    </div>
                  </div>
                  <div className="mission-vision-content">
                    <p>
                      To be recognized as a leading chocolate brand that blends
                      technology, craftsmanship, and creativity, delivering
                      consistent quality, innovative flavors, and unforgettable
                      chocolate experiences worldwide.
                    </p>
                  </div>
                </RevealItem>
              </div>
              {/* Approach Content End */}
            </div>
          </div>
        </RevealWrapper>
      </div>
      {/* Our Approach Section End */}

      {/* Why Choose Us Section Start */}
      <div className="why-choose-us bg-section">
        <RevealWrapper className="container">
          <div className="row">
            <div className="col-lg-6">
              {/* Why Choose Content Start */}
              <div className="why-choose-content">
                <div className="section-title">
                  <RevealItem>
                    <h3 className="wow fadeInUp">Why choose us</h3>
                  </RevealItem>
                  <RevealItem>
                    <h2 className="text-anime-style-2" data-cursor="-opaque">
                      From Our Factory to You – Chocolate You Can Trust{" "}
                    </h2>
                  </RevealItem>
                  <RevealItem>
                    <p className="wow fadeInUp" data-wow-delay="0.2s">
                      From our factory to your taste buds, we combine the finest
                      cocoa with premium ingredients to create chocolates that
                      excite your senses, spark joy, and make every moment
                      sweeter.
                    </p>
                  </RevealItem>
                </div>

                <div className="why-choose-item-list">
                  <RevealItem
                    className="why-choose-item wow fadeInUp"
                    data-wow-delay="0.4s"
                  >
                    <div className="icon-box">
                      <Image src="/images/icon-why-choose-1.svg" alt="Quality Icon" width={60} height={60} quality={90} />
                    </div>
                    <div className="why-choose-item-content">
                      <h3>Premium Quality, Every Time</h3>
                      <p>
                        We use the finest cocoa and ingredients, ensuring each
                        chocolate meets our highest standards of taste, texture,
                        and freshness.
                      </p>
                    </div>
                  </RevealItem>

                  <RevealItem
                    className="why-choose-item wow fadeInUp"
                    data-wow-delay="0.6s"
                  >
                    <div className="icon-box">
                      <Image src="/images/icon-why-choose-2.svg" alt="Consistency Icon" width={60} height={60} quality={90} />
                    </div>
                    <div className="why-choose-item-content">
                      <h3>Consistency & Precision</h3>
                      <p>
                        Our state-of-the-art factory ensures every batch is
                        perfectly made, delivering the same exceptional taste
                        every time.
                      </p>
                    </div>
                  </RevealItem>

                  <RevealItem
                    className="why-choose-item wow fadeInUp"
                    data-wow-delay="0.8s"
                  >
                    <div className="icon-box">
                      <Image src="/images/icon-why-choose-3.svg" alt="Occasion Icon" width={60} height={60} quality={90} />
                    </div>
                    <div className="why-choose-item-content">
                      <h3>Perfect for Every Occasion</h3>
                      <p>
                        Whether for gifting, celebrations, or personal
                        indulgence, Melova chocolates make every moment special.
                      </p>
                    </div>
                  </RevealItem>
                </div>
              </div>
              {/* Why Choose Content End */}
            </div>

            <div className="col-lg-6">
              {/* Why Choose Images Start */}
              <div className="why-choose-images">
                <div className="why-choose-image-box-1">
                  <RevealItem className="why-choose-image relative h-[300px] wow fadeInUp">
                    <figure className="image-anime h-full">
                      <Image src="/img/about-2.png" alt="Chocolate Crafting" fill quality={90} className="object-cover" />
                    </figure>

                    <div className="why-choose-cta-box">
                      <div className="icon-box">
                        <Image src="/images/icon-headset.svg" alt="Support Icon" width={40} height={40} quality={90} />
                      </div>
                      <div className="why-choose-cta-content">
                        <p>Have questions? Let&apos;s talk chocolate!</p>
                      </div>
                    </div>
                  </RevealItem>

                  <RevealItem
                    className="google-rating-box wow fadeInUp"
                    data-wow-delay="0.2s"
                  >
                    <div className="google-rating-content">
                      <p>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                      </p>
                      <p>More Than 1K+ Chocolate Lovers</p>
                    </div>
                  </RevealItem>
                </div>

                <div className="why-choose-image-box-2">
                  <RevealItem className="why-choose-image relative h-[350px]">
                    <figure className="image-anime h-full">
                      <Image src="/img/about-3.png" alt="Chocolate Selection" fill quality={90} className="object-cover" />
                    </figure>
                  </RevealItem>
                </div>
              </div>
              {/* Why Choose Images End */}
            </div>
          </div>
        </RevealWrapper>
      </div>
      {/* Why Choose Us Section End */}

      {/* What We Do Section Start */}
      <div className="what-we-do bg-section parallaxie">
        <RevealWrapper className="container-fluid">
          <div className="row no-gutters align-items-center">
            <div className="col-lg-6">
              {/* What We Video Start */}
              <RevealItem className="what-we-video">
                <div className="video-play-button bg-effect">
                  <a href="#" className="popup-video" data-cursor-text="Play">
                    <i className="fa-solid fa-play"></i>
                  </a>
                </div>
              </RevealItem>
              {/* What We Video End */}
            </div>

            <div className="col-lg-6">
              {/* What We Content Start */}
              <div className="what-we-content">
                <div className="section-title">
                  <RevealItem>
                    <h3 className="wow fadeInUp">What we do</h3>
                  </RevealItem>
                  <RevealItem>
                    <h2 className="text-anime-style-2" data-cursor="-opaque">
                      Where Chocolate Dreams Come Alive
                    </h2>
                  </RevealItem>
                </div>

                <div className="what-we-list">
                  <RevealItem
                    className="what-we-item wow fadeInUp"
                    data-wow-delay="0.2s"
                  >
                    <div className="what-we-header">
                      <h4>Seasonal Specials</h4>
                      <h3>Limited-Edition Treats to Celebrate Every Moment</h3>
                    </div>
                    <div className="what-we-body">
                      <p>
                        Our seasonal chocolates are crafted for special
                        occasions and festivities, combining unique flavors and
                        artistic designs that make every celebration sweeter.
                      </p>
                    </div>
                  </RevealItem>

                  <RevealItem
                    className="what-we-item wow fadeInUp"
                    data-wow-delay="0.4s"
                  >
                    <div className="what-we-header">
                      <h4>Gift Collections</h4>
                      <h3>Perfectly Curated Chocolates for Every Occasion</h3>
                    </div>
                    <div className="what-we-body">
                      <p>
                        From personalized boxes to premium assortments, our gift
                        collections are designed to delight loved ones and make
                        every moment unforgettable.
                      </p>
                    </div>
                  </RevealItem>
                </div>

                <RevealItem className="what-we-btn wow fadeInUp" data-wow-delay="0.6s">
                  <Link href="/contact" className="btn-default">
                    Contact Us
                  </Link>
                </RevealItem>
              </div>
              {/* What We Content End */}
            </div>
          </div>
        </RevealWrapper>
      </div>
      {/* What We Do Section End */}
    </>
  );
}
