import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-[#562c1b] pt-16 pb-8 overflow-hidden">
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-12"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 768 48"
          preserveAspectRatio="none"
        >
          <path
            fill="var(--bg-color)"
            d="M241.283 15.337C98.3615 29.6176 20.877 18.502 0 11.1592V48H768V21.4138C646.845 -9.72996 419.936 -2.51371 241.283 15.337Z"
          ></path>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8 p-4 l transition-transform hover:scale-105 duration-300">
            <Image
              src="/img/melova_logo.png"
              alt="Melova Logo"
              width={200}
              height={64}
              quality={90}
              className="h-16 w-auto drop-shadow-lg"
            />
          </div>

          {/* Navigation Links */}
          <nav className="mb-10 w-full max-w-3xl">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-stone-300 font-medium tracking-wide">
              <li>
                <Link
                  href="/"
                  className="hover:text-amber-400 text-stone-300 transition-colors duration-300 relative group"
                >
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-amber-400 text-stone-300 transition-colors duration-300 relative group"
                >
                  About Us
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-amber-400 text-stone-300 transition-colors duration-300 relative group"
                >
                  Products
                  <span className="absolute -bottom-1 text-stone-300 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-amber-400 text-stone-300 transition-colors duration-300 relative group"
                >
                  Blogs
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-amber-400 text-stone-300 transition-colors duration-300 relative group"
                >
                  Contact Us
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact & Social */}
          <div className="flex flex-col items-center space-y-6 mb-12">
            <a
              href="tel:+971543072440"
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600 hover:from-amber-200 hover:to-amber-500 transition-all duration-300 drop-shadow-sm"
            >
              +971 54 307 2440
            </a>

            <div>
              <h3 className="text-sm uppercase tracking-widest text-stone-500 mb-4 font-semibold">
                Follow Us On Socials
              </h3>
              <ul className="flex justify-center space-x-5">
                <li>
                  <a
                    href="https://www.instagram.com/mymelova/"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-800 text-stone-300 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-pink-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                  >
                    <i className="fa-brands fa-instagram text-lg"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-800 text-stone-300 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                  >
                    <i className="fa-brands fa-facebook-f text-lg"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-800 text-stone-300 hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                  >
                    <i className="fa-brands fa-youtube text-lg"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-800 text-stone-300 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                  >
                    <i className="fa-brands fa-linkedin-in text-lg"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent my-6"></div>

        {/* Copyright */}
        <div className="text-stone-500 text-sm">
          <p>
            Copyright © {new Date().getFullYear()} MyMelova. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
