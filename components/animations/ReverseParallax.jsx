"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ReverseParallax({ children, className = "", bgImage }) {
  const ref = useRef(null);
  
  // Track scroll position relative to the container
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Reverse parallax: As we scroll down, the background shifts downwards relative to the container
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <div 
      ref={ref} 
      className={`relative overflow-hidden ${className}`}
      style={{ background: "transparent" }}
    >
      {bgImage && (
        <motion.div
          className="absolute inset-0 z-0 h-[130%] w-full origin-top"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            y,
            top: "-15%",
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
