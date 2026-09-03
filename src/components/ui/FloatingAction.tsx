"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Home, User, Briefcase, Code2, GraduationCap, Mail, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "#hero", icon: Home },
  { label: "About", href: "#about", icon: User },
  { label: "Skills", href: "#skills", icon: Code2 },
  { label: "Projects", href: "#projects", icon: Briefcase },
  { label: "Education", href: "#education", icon: GraduationCap },
  { label: "Contact", href: "#contact", icon: Mail },
];

// Tint derived from the live accent token so the button re-colours with the
// theme instead of staying locked to the dark theme's purple.
const accent = (pct: number) => `color-mix(in srgb, var(--color-accent) ${pct}%, transparent)`;

export default function FloatingAction() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen &&
            navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: 30, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  transition={{ delay: index * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center gap-3"
                >
                  <motion.span
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 + 0.08 }}
                    className="px-3 py-1.5 rounded-lg bg-bg-card border border-border text-[11px] font-medium text-text opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg"
                  >
                    {item.label}
                  </motion.span>
                  <div className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all duration-200">
                    <Icon size={16} />
                  </div>
                </motion.a>
              );
            })}
        </AnimatePresence>

        {/* FAB Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl cursor-pointer"
          style={{ boxShadow: `0 0 20px ${accent(22)}` }}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
        >
          {/* Border */}
          <motion.div
            className="absolute inset-0 rounded-xl border"
            animate={{ borderColor: isOpen ? accent(60) : accent(32) }}
            transition={{ duration: 0.3 }}
          />

          {/* BG */}
          <div className="absolute inset-0 rounded-xl bg-bg-card" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-accent"
                >
                  <X size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="kd"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <span className="text-lg font-black font-[family-name:var(--font-logo)] text-text">K</span>
                  <span className="text-lg font-black font-[family-name:var(--font-logo)] text-accent">D</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.button>
      </div>
    </>
  );
}
