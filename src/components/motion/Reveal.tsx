"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Seconds to wait before the animation starts (use for staggering siblings). */
  delay?: number;
  /** Starting offsets; numbers are px, strings may be % of the element's own size. */
  x?: number | string;
  y?: number | string;
  scale?: number;
  rotate?: number;
  duration?: number;
  /** Fraction of the element that must be visible before it plays. */
  amount?: number;
  /** Element to render (use "li" when the parent is a list). */
  as?: "div" | "li";
};

/** Fades and slides its children into place the first time they scroll into view. */
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  x = 0,
  y = 36,
  scale = 1,
  rotate = 0,
  duration = 0.9,
  amount = 0.15,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className} style={style}>
        {children}
      </Plain>
    );
  }
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, x, y, scale, rotate }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
