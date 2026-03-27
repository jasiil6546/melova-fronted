"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30, 
    filter: "blur(15px)", 
    scale: 0.98 
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1], // Custom ease-out
    },
  },
};

// Global session Set kept in memory.
// It tracks which pages (pathnames) have already played the animation.
const animatedPaths = new Set();

export function RevealWrapper({ children, className = "" }) {
  const pathname = usePathname();

  // Determine if we should animate based on whether this specific page has animated yet
  const [shouldAnimate] = useState(() => !animatedPaths.has(pathname));

  useEffect(() => {
    // Mark this page as animated once it hits the DOM
    if (pathname && !animatedPaths.has(pathname)) {
      animatedPaths.add(pathname);
    }
  }, [pathname]);

  return (
    <motion.div
      variants={containerVariants}
      // Start hidden only if it's the first time visiting THIS page; otherwise bypass to 'visible'
      initial={shouldAnimate ? "hidden" : "visible"}
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = "" }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
