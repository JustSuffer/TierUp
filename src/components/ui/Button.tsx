"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "glass" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative rounded-full font-medium tracking-wide transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden",
        {
          "px-4 py-2 text-sm": size === "sm",
          "px-6 py-3 text-base": size === "md",
          "px-8 py-4 text-lg": size === "lg",
          
          "bg-white text-brand-black hover:bg-gray-100": variant === "primary",
          "bg-gradient-to-r from-brand-purple-dark to-brand-burgundy-dark text-white hover:opacity-90": variant === "secondary",
          "glass text-white hover:bg-white/10": variant === "glass",
          "text-white/70 hover:text-white hover:bg-white/5": variant === "ghost",
        },
        className
      )}
      {...props}
    >
      {/* Glossy overlay effect for primary/secondary buttons */}
      {(variant === "primary" || variant === "secondary") && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-white/10 to-white/0 pointer-events-none" />
      )}
      {children}
    </motion.button>
  );
}
