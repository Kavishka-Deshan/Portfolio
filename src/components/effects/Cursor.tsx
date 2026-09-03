"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, type MotionValue } from "framer-motion";

/*
 * Three layers:
 *   comet tail — six dots chasing the pointer on progressively softer springs,
 *                shrinking and fading down the tail
 *   ring       — trails on a medium spring, swells over interactive elements
 *   dot        — tracks the pointer almost exactly
 *
 * All DOM + transform, so it stays on the compositor. The earlier canvas comet
 * repainted the whole viewport every frame; nothing here paints on the CPU.
 */

const INTERACTIVE = 'a, button, input, textarea, select, [role="button"], [data-cursor="hover"]';

// Softer stiffness => further behind the head of the comet.
const TAIL = [
  { stiffness: 320, damping: 26, size: 6.5, opacity: 0.55 },
  { stiffness: 240, damping: 26, size: 5.5, opacity: 0.44 },
  { stiffness: 185, damping: 26, size: 4.5, opacity: 0.34 },
  { stiffness: 145, damping: 26, size: 3.6, opacity: 0.25 },
  { stiffness: 115, damping: 26, size: 2.8, opacity: 0.17 },
  { stiffness: 92, damping: 26, size: 2.1, opacity: 0.1 },
];

function TailDot({
  x,
  y,
  spec,
  visible,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  spec: (typeof TAIL)[number];
  visible: boolean;
}) {
  const tx = useSpring(x, { stiffness: spec.stiffness, damping: spec.damping, mass: 0.5 });
  const ty = useSpring(y, { stiffness: spec.stiffness, damping: spec.damping, mass: 0.5 });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9997] rounded-full will-change-transform"
      style={{
        x: tx,
        y: ty,
        translateX: "-50%",
        translateY: "-50%",
        width: spec.size,
        height: spec.size,
        backgroundColor: "var(--color-accent)",
        boxShadow: `0 0 ${spec.size * 2.4}px color-mix(in srgb, var(--color-accent) 60%, transparent)`,
      }}
      animate={{ opacity: visible ? spec.opacity : 0 }}
      transition={{ duration: 0.25 }}
    />
  );
}

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const dotX = useSpring(x, { stiffness: 1500, damping: 70, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 1500, damping: 70, mass: 0.2 });
  const ringX = useSpring(x, { stiffness: 210, damping: 22, mass: 0.55 });
  const ringY = useSpring(y, { stiffness: 210, damping: 22, mass: 0.55 });

  useEffect(() => {
    // Pointing devices only — never hijack touch.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    // Hide the native cursor only once this is mounted, so a JS failure can
    // never leave the page with no cursor at all.
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      setHovering(Boolean((e.target as Element | null)?.closest?.(INTERACTIVE)));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointerleave", leave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {TAIL.map((spec, i) => (
        <TailDot key={i} x={x} y={y} spec={spec} visible={visible && !hovering} />
      ))}

      {/* Trailing ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full will-change-transform"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: 38,
          height: 38,
          border: "1px solid color-mix(in srgb, var(--color-accent) 55%, transparent)",
        }}
        animate={{
          scale: pressed ? 0.8 : hovering ? 1.7 : 1,
          opacity: visible ? 1 : 0,
          backgroundColor: hovering
            ? "color-mix(in srgb, var(--color-accent) 12%, transparent)"
            : "color-mix(in srgb, var(--color-accent) 0%, transparent)",
          boxShadow: hovering
            ? "0 0 26px color-mix(in srgb, var(--color-accent) 34%, transparent)"
            : "0 0 14px color-mix(in srgb, var(--color-accent) 16%, transparent)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 24, mass: 0.5 }}
      />

      {/* Comet head */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full will-change-transform"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: 8,
          height: 8,
          backgroundColor: "var(--color-accent)",
          boxShadow:
            "0 0 12px color-mix(in srgb, var(--color-accent) 85%, transparent), 0 0 28px color-mix(in srgb, var(--color-accent) 45%, transparent)",
        }}
        animate={{
          scale: pressed ? 1.5 : hovering ? 0.4 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 26, mass: 0.4 }}
      />
    </>
  );
}
