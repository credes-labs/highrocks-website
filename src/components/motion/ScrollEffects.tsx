"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

/** Moves its children slower than the page (parallax) and zooms in slightly as the page scrolls. */
export function ParallaxLayer({
  children,
  className,
  style,
  distance = 180,
  zoom = 0.08,
  range = 900,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  distance?: number;
  zoom?: number;
  range?: number;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, range], [0, reduce ? 0 : distance]);
  const scale = useTransform(scrollY, [0, range], [1, reduce ? 1 : 1 + zoom]);
  return (
    <motion.div className={className} style={{ ...style, y, scale }}>
      {children}
    </motion.div>
  );
}

/** Fades and lifts its children away as the user scrolls down from the top of the page. */
export function ScrollFade({
  children,
  className,
  range = 520,
  lift = 70,
}: {
  children: ReactNode;
  className?: string;
  range?: number;
  lift?: number;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, range], [1, reduce ? 1 : 0]);
  const y = useTransform(scrollY, [0, range], [0, reduce ? 0 : -lift]);
  return (
    <motion.div className={className} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}
