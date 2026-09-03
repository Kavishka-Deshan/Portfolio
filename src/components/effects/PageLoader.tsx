"use client";

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

/*
 * Entrance: the original orbiting-rings loader.
 *
 * The shape is the first design — a bordered monogram tile with two
 * counter-rotating orbits, LOADING, and a progress rail. The motion on top of
 * it is new:
 *   · a conic gradient sweeps continuously around the tile's border
 *   · the monogram glitches with a brief RGB split at intervals
 *   · motes converge inward toward the tile instead of drifting away
 *   · LOADING resolves out of scrambled glyphs
 *   · a highlight shimmers along the filled part of the rail
 *
 * Every colour comes from the theme tokens, so it is purple / green / lime with
 * the rest of the site rather than the hardcoded violet the first version used.
 */

const HOLD_MS = 1800;

/*
 * Converging motes. Positions are derived from the index, never Math.random() —
 * this overlay is server-rendered too, and random values would produce a
 * different DOM on the client and trip a hydration mismatch.
 */
const MOTES = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  return {
    x: Math.cos(angle) * 300,
    y: Math.sin(angle) * 220,
    size: 2 + (i % 3),
    delay: (i % 7) * 0.22,
    duration: 2.2 + (i % 3) * 0.5,
  };
});

const WORD = "LOADING";
const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&/<>";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [word, setWord] = useState(WORD);

  const count = useMotionValue(0);
  const shown = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
  const railWidth = useTransform(count, (v) => `${v}%`);
  const dotLeft = useTransform(count, [0, 100], ["0%", "97%"]);

  useEffect(() => {
    const controls = animate(count, 100, {
      duration: HOLD_MS / 1000,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [count]);

  // LOADING resolves left-to-right out of noise.
  useEffect(() => {
    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      const locked = Math.floor(frame / 2);
      setWord(
        WORD.split("")
          .map((ch, i) => (i < locked ? ch : POOL[(frame * 7 + i * 13) % POOL.length]))
          .join(""),
      );
      if (locked >= WORD.length) {
        setWord(WORD);
        clearInterval(id);
      }
    }, 55);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const done = () => setLoading(false);
    const timer = setTimeout(done, HOLD_MS);

    /*
     * Chrome heavily throttles setTimeout in unfocused tabs. This overlay is
     * fixed, full-screen and hit-testable, so a throttled timer would leave it
     * swallowing every click underneath — open the site in a background tab and
     * it was unusable on arrival. Clearing on the next visibility change means
     * it is gone the moment the visitor actually looks at the page.
     */
    const onVisible = () => {
      if (!document.hidden) done();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg overflow-hidden"
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)", pointerEvents: "none" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Breathing bloom */}
          <motion.div
            className="absolute w-[520px] h-[520px] rounded-full blur-[150px] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 22%, transparent) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Grid backdrop */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-accent) 1px, transparent 1px), linear-gradient(to bottom, var(--color-accent) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Motes converging on the tile */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
            {MOTES.map((m, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-accent"
                style={{ width: m.size, height: m.size }}
                initial={{ x: m.x, y: m.y, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: [0, 0.7, 0] }}
                transition={{
                  duration: m.duration,
                  delay: m.delay,
                  repeat: Infinity,
                  ease: "easeIn",
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center gap-10">
            {/* Monogram tile with its orbits */}
            <div className="relative">
              {/* Single soft pulse */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-2xl border pointer-events-none"
                style={{ borderColor: "color-mix(in srgb, var(--color-accent) 35%, transparent)" }}
                animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />

              {/* Outer orbit, clockwise */}
              <motion.div
                className="absolute inset-[-30px] will-change-transform"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neon-bright shadow-[0_0_10px_var(--color-neon-bright)]" />
              </motion.div>

              {/* Inner orbit, counter-clockwise */}
              <motion.div
                className="absolute inset-[-16px] will-change-transform"
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-1 rounded-full bg-accent/70" />
              </motion.div>

              {/* Conic gradient sweeping the tile border */}
              <motion.div
                className="absolute inset-[-2px] rounded-2xl pointer-events-none"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb, var(--color-accent) 85%, transparent) 40deg, transparent 110deg)",
                  // Punch out the middle so only a border ring shows.
                  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: 2,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
              />

              {/* The tile */}
              <motion.div
                className="relative w-24 h-24 rounded-2xl border-2 flex items-center justify-center bg-bg-card/50 backdrop-blur-sm"
                style={{ borderColor: "color-mix(in srgb, var(--color-accent) 22%, transparent)" }}
                initial={{ scale: 0.85, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Monogram with a periodic RGB-split glitch */}
                <motion.div
                  className="flex items-center font-[family-name:var(--font-mono)] text-2xl font-bold"
                  animate={{
                    x: [0, 0, -2, 2, 0],
                    textShadow: [
                      "0 0 0 transparent",
                      "0 0 0 transparent",
                      "2px 0 var(--color-neon-bright), -2px 0 color-mix(in srgb, var(--color-accent) 90%, transparent)",
                      "-2px 0 var(--color-neon-bright), 2px 0 color-mix(in srgb, var(--color-accent) 90%, transparent)",
                      "0 0 0 transparent",
                    ],
                  }}
                  transition={{ duration: 0.45, repeat: Infinity, repeatDelay: 1.5, times: [0, 0.5, 0.65, 0.8, 1] }}
                >
                  {["K", "D"].map((ch, i) => (
                    <span key={ch} className="inline-block overflow-hidden leading-[1.1]">
                      <motion.span
                        className={`inline-block ${i === 0 ? "text-text" : "text-accent"}`}
                        initial={{ y: "115%" }}
                        animate={{ y: "0%" }}
                        transition={{ delay: 0.25 + i * 0.09, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {ch}
                      </motion.span>
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* LOADING, resolving out of scrambled glyphs */}
            <div className="overflow-hidden">
              <motion.div
                className="flex items-center gap-3"
                initial={{ y: 34, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-mono text-[11px] tracking-[0.42em] uppercase text-text-muted tabular-nums">
                  {word}
                </span>
                <motion.span
                  className="font-mono text-[11px] text-accent"
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                >
                  {"///"}
                </motion.span>
              </motion.div>
            </div>

            {/* Progress rail */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-56">
                <div className="w-full h-[2px] bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="relative h-full rounded-full overflow-hidden"
                    style={{
                      width: railWidth,
                      background:
                        "linear-gradient(90deg, var(--color-accent), var(--color-neon-bright))",
                    }}
                  >
                    {/* Highlight shimmering along the filled portion */}
                    <motion.div
                      className="absolute inset-y-0 w-10"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)",
                      }}
                      animate={{ x: ["-40px", "240px"] }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                </div>
                {/* Glow riding the head of the fill */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-8 h-4 rounded-full blur-sm pointer-events-none"
                  style={{
                    left: dotLeft,
                    background: "color-mix(in srgb, var(--color-accent) 55%, transparent)",
                  }}
                />
              </div>

              <motion.div
                className="flex items-baseline gap-1 font-mono text-text-dim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                <motion.span className="text-[11px] tabular-nums">{shown}</motion.span>
                <span className="text-[9px] text-accent">%</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
