"use client";

import { motion } from "framer-motion";
import React from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right"; // Añadimos direcciones para variedad
}

export default function FadeIn({ children, delay = 0, className = "", direction = "up" }: FadeInProps) {
  // Definimos el movimiento según la dirección
  const offsets = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...offsets[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, margin: "-100px" }} // Se activa una sola vez al entrar en vista
      transition={{
        duration: 0.7,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98], // Curva de suavizado más elegante
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}