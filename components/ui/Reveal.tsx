"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

const variants: Variants = {
  hidden: (custom: { y: number }) => ({ opacity: 0, y: custom.y }),
  visible: { opacity: 1, y: 0 },
};

/** Anime l'apparition d'un bloc lorsqu'il entre dans le viewport. */
export function Reveal({ children, delay = 0, y = 20, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      custom={{ y }}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.5, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}
