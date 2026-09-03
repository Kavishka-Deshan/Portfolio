"use client";

import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import { useRef } from "react";

type AnimationType =
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "scaleIn"
  | "blurIn"
  | "staggerContainer";

interface AnimatedSectionProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

const getVariants = (
  type: AnimationType,
  distance: number
): { container?: Variants; item?: Variants } => {
  switch (type) {
    case "fadeUp":
      return {
        item: {
          hidden: { opacity: 0, y: distance },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
          },
        },
      };
    case "fadeDown":
      return {
        item: {
          hidden: { opacity: 0, y: -distance },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
          },
        },
      };
    case "fadeLeft":
      return {
        item: {
          hidden: { opacity: 0, x: distance },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
          },
        },
      };
    case "fadeRight":
      return {
        item: {
          hidden: { opacity: 0, x: -distance },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
          },
        },
      };
    case "scaleIn":
      return {
        item: {
          hidden: { opacity: 0, scale: 0.92 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
          },
        },
      };
    case "blurIn":
      return {
        item: {
          hidden: { opacity: 0, filter: "blur(8px)", y: 12 },
          visible: {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
          },
        },
      };
    case "staggerContainer":
      return {
        container: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.1,
            },
          },
        },
        item: {
          hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
          },
        },
      };
    default:
      return {};
  }
};

export default function AnimatedSection({
  children,
  animation = "fadeUp",
  delay = 0,
  duration = 0.6,
  distance = 30,
  className = "",
  once = true,
  ...props
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const variants = getVariants(animation, distance);

  if (animation === "staggerContainer") {
    return (
      <motion.div
        ref={ref}
        variants={variants.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.15 }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={variants.item}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      transition={{ delay, duration }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "ref">) {
  return (
    <motion.div
    variants={{
      hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
      },
    }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
