"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

const themeKDColors: Record<string, { char: string; hoverY: number; hoverRotate: number; hoverScale: number; color: string }[]> = {
  dark: [
    { char: "<", hoverY: -16, hoverRotate: 0, hoverScale: 1.3, color: "#a855f7" },
    { char: "/", hoverY: 0, hoverRotate: 360, hoverScale: 1.1, color: "#c084fc" },
    { char: "K", hoverY: -6, hoverRotate: -12, hoverScale: 1.25, color: "#e879f9" },
    { char: "D", hoverY: 0, hoverRotate: 0, hoverScale: 1.4, color: "#a855f7" },
    { char: ">", hoverY: -12, hoverRotate: 12, hoverScale: 1.2, color: "#c084fc" },
  ],
  light: [
    { char: "<", hoverY: -16, hoverRotate: 0, hoverScale: 1.3, color: "#1a8a00" },
    { char: "/", hoverY: 0, hoverRotate: 360, hoverScale: 1.1, color: "#22a500" },
    { char: "K", hoverY: -6, hoverRotate: -12, hoverScale: 1.25, color: "#32cd32" },
    { char: "D", hoverY: 0, hoverRotate: 0, hoverScale: 1.4, color: "#1a8a00" },
    { char: ">", hoverY: -12, hoverRotate: 12, hoverScale: 1.2, color: "#22a500" },
  ],
  cyber: [
    { char: "<", hoverY: -16, hoverRotate: 0, hoverScale: 1.3, color: "#a3ff00" },
    { char: "/", hoverY: 0, hoverRotate: 360, hoverScale: 1.1, color: "#c8ff44" },
    { char: "K", hoverY: -6, hoverRotate: -12, hoverScale: 1.25, color: "#b8ff33" },
    { char: "D", hoverY: 0, hoverRotate: 0, hoverScale: 1.4, color: "#a3ff00" },
    { char: ">", hoverY: -12, hoverRotate: 12, hoverScale: 1.2, color: "#c8ff44" },
  ],
};

/*
 * Soft chime for the logo.
 *
 * The old version was a bare sine that jumped straight to full gain — an
 * instant attack is what makes a tone read as a harsh "beep". This fades in
 * over ~30ms, pairs the root with a quiet fifth above it, and runs both
 * through a low-pass so nothing sharp survives.
 */
const playHoverSound = (() => {
  let ctx: AudioContext | null = null;
  return (freq: number) => {
    try {
      if (typeof window === "undefined") return;
      if (!ctx) {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        ctx = new Ctor();
      }
      if (ctx.state === "suspended") void ctx.resume();

      const t = ctx.currentTime;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1800;
      lp.Q.value = 0.6;
      lp.connect(ctx.destination);

      // Root plus a fifth — an interval reads as musical rather than as an alert.
      [
        { f: freq * 0.5, g: 0.035 },
        { f: freq * 0.75, g: 0.018 },
      ].forEach(({ f, g }) => {
        const osc = ctx!.createOscillator();
        const gain = ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(g, t + 0.03); // soft attack
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55); // long tail
        osc.connect(gain).connect(lp);
        osc.start(t);
        osc.stop(t + 0.6);
      });
    } catch {
      /* audio is decorative */
    }
  };
})();

function KDLogo() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  // Glyphs currently shown for K and D while the scramble resolves.
  const [scramble, setScramble] = useState<{ k: string; d: string }>({ k: "K", d: "D" });

  const kdChars = themeKDColors[theme] || themeKDColors.dark;
  const accentRgb = theme === "light" ? "26,138,0" : theme === "cyber" ? "163,255,0" : "168,85,247";

  /*
   * Magnetic pull: the whole mark eases toward the cursor within its own box,
   * then springs back. Clamped so it never drifts into the nav links.
   */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const magX = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.4 });
  const magY = useSpring(my, { stiffness: 260, damping: 18, mass: 0.4 });

  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const smoothGlowX = useSpring(glowX, { stiffness: 200, damping: 30 });
  const smoothGlowY = useSpring(glowY, { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    glowX.set(((e.clientX - r.left) / r.width) * 100);
    glowY.set(((e.clientY - r.top) / r.height) * 100);
    // Offset from centre, damped to a few pixels.
    mx.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 14);
    my.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 10);
  };

  const reset = () => {
    setIsHovered(false);
    mx.set(0);
    my.set(0);
  };

  /*
   * Decode effect: K and D cycle through random glyphs and lock in, one after
   * the other. Reads as a terminal resolving text.
   */
  useEffect(() => {
    if (!isHovered) {
      setScramble({ k: "K", d: "D" });
      return;
    }
    const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&@*<>/[]{}";
    const pick = () => pool[Math.floor(Math.random() * pool.length)];
    let frame = 0;
    const id = setInterval(() => {
      frame += 1;
      setScramble({
        k: frame > 6 ? "K" : pick(),
        d: frame > 10 ? "D" : pick(),
      });
      if (frame > 10) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [isHovered]);

  const glyph = (c: string) => (c === "K" ? scramble.k : c === "D" ? scramble.d : c);

  return (
    <motion.a
      href="#hero"
      ref={containerRef}
      aria-label="Kavishka Deshan — back to top"
      className="relative flex items-center py-2 px-1 group"
      style={{ x: magX, y: magY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        playHoverSound(880);
      }}
      onMouseLeave={reset}
    >
      <div className="relative flex items-center">
        {kdChars.map((c, i) => {
          // Brackets ease outward on hover; the letters hold the centre.
          const isBracket = c.char === "<" || c.char === ">";
          const spread = isBracket ? (c.char === "<" ? -5 : 5) : 0;

          return (
            <motion.span
              key={`${theme}-${i}`}
              className="text-2xl font-bold font-[family-name:var(--font-mono)] cursor-pointer select-none inline-block"
              style={{ color: c.color }}
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                x: isHovered ? spread : 0,
                textShadow: isHovered
                  ? `0 0 18px ${c.color}88, 0 0 34px ${c.color}44`
                  : `0 0 0px ${c.color}00`,
              }}
              transition={{
                opacity: { delay: 0.3 + i * 0.08, duration: 0.4 },
                y: { delay: 0.3 + i * 0.08, type: "spring", stiffness: 400, damping: 15 },
                scale: { delay: 0.3 + i * 0.08, type: "spring", stiffness: 400, damping: 15 },
                default: { type: "spring", stiffness: 320, damping: 22 },
              }}
            >
              {glyph(c.char)}
            </motion.span>
          );
        })}

        {/* Underline that draws in from the left */}
        <motion.span
          className="absolute -bottom-0.5 left-0 h-[2px] rounded-full pointer-events-none"
          style={{ background: `rgb(${accentRgb})` }}
          animate={{ width: isHovered ? "100%" : "0%", opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Cursor-tracked glow */}
        <motion.div
          className="absolute inset-[-10px] rounded-xl pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            background: useMotionTemplate`radial-gradient(circle at ${smoothGlowX}% ${smoothGlowY}%, rgba(${accentRgb},0.32) 0%, transparent 60%)`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.a>
  );
}
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      // Track active section
      const sections = ["about", "skills", "projects", "education", "contact"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(id);
          break;
        }
      }
    };
    // Run once on mount: landing on an anchor (/#contact) or a restored scroll
    // position otherwise leaves the bar transparent over content until the
    // first scroll event.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
      aria-label="Main navigation"
    >
      {/*
        Detaches from the top edge into a floating glass "island" once you
        scroll, instead of staying a full-bleed bar. The wrapper handles the
        inset; the inner surface carries the glass, border and glow.
      */}
      <div
        className={`mx-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? "max-w-5xl px-4 pt-3" : "max-w-6xl px-6 pt-0"
        }`}
      >
        <div
          className={`relative flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled
              ? "h-14 px-5 rounded-2xl border backdrop-blur-2xl"
              : "h-[4.5rem] px-0 rounded-none border-transparent"
          }`}
          style={
            scrolled
              ? {
                  background: "color-mix(in srgb, var(--color-bg-card) 72%, transparent)",
                  borderColor: "color-mix(in srgb, var(--color-accent) 16%, transparent)",
                  boxShadow:
                    "0 12px 40px rgba(0,0,0,0.35), 0 0 50px color-mix(in srgb, var(--color-accent) 10%, transparent), inset 0 1px 0 rgba(255,255,255,0.06)",
                }
              : undefined
          }
        >
          {/* Hairline highlight along the top of the island */}
          {scrolled && (
            <motion.div
              className="absolute top-0 left-6 right-6 h-px pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, transparent, color-mix(in srgb, var(--color-accent) 45%, transparent), transparent)",
              }}
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          <KDLogo />

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.a
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-300 ${
                    isActive ? "text-accent" : "text-text-muted hover:text-text"
                  }`}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Filled pill glides between links via shared layoutId */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-xl -z-10"
                      style={{
                        background: "color-mix(in srgb, var(--color-accent) 14%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--color-accent) 28%, transparent)",
                        boxShadow: "0 0 18px color-mix(in srgb, var(--color-accent) 18%, transparent)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </motion.a>
              </motion.li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <ThemeToggle />
          </motion.div>
          <motion.button
            className="md:hidden w-10 h-10 rounded-xl border border-border bg-bg-panel flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 hover:bg-accent/8 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={16} />
                </motion.div>
              ) : (
                <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden mx-4 mt-2 rounded-2xl border bg-bg-card/90 backdrop-blur-2xl border-accent/15 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          >
            <ul className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <a
                    href={link.href}
                    className="text-text-muted text-sm font-medium hover:text-accent transition-colors duration-300 block py-3 px-3 rounded-lg hover:bg-accent/5"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
