"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Zap } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const confettiColors = ["#a3ff00", "#c8ff44", "#b8ff33", "#7acc00", "#e879f9", "#a855f7", "#c084fc"];

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  size: number;
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  // A plain ref counter: useCallback around an IIFE has dependencies the
  // linter cannot analyse, and this never needs to change identity.
  const idRef = useRef(0);
  const nextId = () => idRef.current++;

  const icons = {
    dark: <Moon size={16} className="text-accent" />,
    light: <Sun size={16} className="text-accent" />,
    cyber: <Zap size={16} className="text-accent" />,
  };

  const labels = {
    dark: "Dark mode",
    light: "Light mode",
    cyber: "Cyber mode",
  };

  const handleToggle = () => {
    const order: string[] = ["dark", "light", "cyber"];
    const nextIdx = (order.indexOf(theme) + 1) % order.length;
    const nextTheme = order[nextIdx];

    // Fire confetti only when switching TO cyber
    if (nextTheme === "cyber") {
      const pieces: ConfettiPiece[] = Array.from({ length: 18 }, (_, i) => ({
        id: nextId(),
        x: 0,
        y: 0,
        color: confettiColors[i % confettiColors.length],
        angle: (360 / 18) * i + Math.random() * 20 - 10,
        size: 4 + Math.random() * 4,
      }));
      setConfetti(pieces);
      setTimeout(() => setConfetti([]), 1200);
    }

    toggleTheme();
  };

  return (
    <motion.button
      onClick={handleToggle}
      className="relative w-10 h-10 rounded-xl border border-border bg-bg-panel flex items-center justify-center hover:border-accent/40 hover:bg-accent/8 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] group"
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.85, rotate: 180 }}
      aria-label={labels[theme]}
      title={labels[theme]}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -120, scale: 0 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 120, scale: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {icons[theme]}
        </motion.div>
      </AnimatePresence>
      {/* Confetti burst */}
      {confetti.map((c) => {
        const rad = (c.angle * Math.PI) / 180;
        const dist = 30 + Math.random() * 30;
        return (
          <motion.div
            key={c.id}
            className="absolute rounded-sm pointer-events-none"
            style={{ backgroundColor: c.color, width: c.size, height: c.size }}
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist - 20,
              rotate: Math.random() * 360 - 180,
              scale: 0,
            }}
            transition={{ duration: 0.8 + Math.random() * 0.4, ease: "easeOut" }}
          />
        );
      })}
      {/* Glow ring on hover */}
      <div className="absolute inset-[-2px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)" }} />
    </motion.button>
  );
}
