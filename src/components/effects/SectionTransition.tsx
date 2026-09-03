"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionTransition({ children, className = "" }: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /*
   * These used to run to opacity 0 and scale 0.98 at both ends, which faded
   * sections out while they were still on screen (content looked like it was
   * disappearing mid-scroll) and forced a repaint of the whole section on every
   * frame. The range is now gentle and never fully hides anything; the scale
   * ramp is gone because scaling a full section is the expensive part.
   */
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.9, 1], [0.55, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.12], [28, 0]);
  const smoothY = useSpring(y, { stiffness: 120, damping: 26, restDelta: 0.01 });

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y: smoothY, willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
