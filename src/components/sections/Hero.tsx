"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import { ArrowRight, Github, Linkedin, Send, Instagram } from "lucide-react";
import Image from "next/image";
import { site } from "@/content/portfolio";

function FloatingOrb({ x, y, size, delay, duration }: { x: number; y: number; size: number; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none will-change-transform"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.5, 0], scale: [0, 1.5, 0], y: [0, -80, -160] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

/*
 * Per-letter hover for the big name.
 *
 * The hovered glyph flips a full turn on X and gains a layered "extrude"
 * text-shadow so it reads as a solid 3D block; every other letter is displaced
 * by a smooth sine falloff around the cursor, so the whole word ripples like a
 * wave rather than each letter reacting on its own.
 */
function AnimatedName({
  text,
  outline = false,
}: {
  text: string;
  outline?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Continuous falloff, not discrete neighbour steps — this is what makes it
  // read as one ripple travelling through the word.
  const wave = (dist: number) => (dist > 3.2 ? 0 : Math.cos((dist / 3.2) * (Math.PI / 2)) ** 2);

  return (
    <span
      className="inline-flex"
      onMouseLeave={() => setHovered(null)}
      style={{ perspective: 900 }}
      aria-label={text}
    >
      {text.split("").map((ch, i) => {
        const dist = hovered === null ? 99 : Math.abs(i - hovered);
        const w = wave(dist);
        const isOn = dist === 0;
        const side = hovered === null || i === hovered ? 0 : i < hovered ? -1 : 1;

        return (
          <motion.span
            key={`${ch}-${i}`}
            aria-hidden="true"
            className="inline-block will-change-transform cursor-default"
            onMouseEnter={() => setHovered(i)}
            style={{
              transformStyle: "preserve-3d",
              ...(outline
                ? { WebkitTextStroke: "2px var(--color-text-dim)", color: "transparent" }
                : {}),
            }}
            animate={{
              // Full flip on the hovered glyph; the rest just ride the wave.
              rotateX: isOn ? 360 : 0,
              y: -18 * w,
              x: side * 7 * w,
              scale: 1 + 0.2 * w,
              color: outline
                ? isOn
                  ? "var(--color-accent)"
                  : "transparent"
                : isOn
                  ? "var(--color-accent)"
                  : "var(--color-text)",
              // Extruded block shadow under the hovered letter.
              textShadow: isOn
                ? [
                    "1px 1px 0 color-mix(in srgb, var(--color-accent) 70%, transparent)",
                    "2px 2px 0 color-mix(in srgb, var(--color-accent) 55%, transparent)",
                    "3px 3px 0 color-mix(in srgb, var(--color-accent) 40%, transparent)",
                    "4px 4px 0 color-mix(in srgb, var(--color-accent) 26%, transparent)",
                    "6px 6px 18px rgba(0,0,0,0.55)",
                  ].join(", ")
                : "0 0 0 rgba(0,0,0,0)",
            }}
            transition={{
              rotateX: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              default: { type: "spring", stiffness: 300, damping: 24, mass: 0.5 },
            }}
          >
            {ch}
          </motion.span>
        );
      })}
    </span>
  );
}

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 1000);
        }
      }, 60);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  /*
   * The animated copy starts empty, so on the server-rendered HTML this text
   * did not exist at all — invisible to crawlers. The full string is now always
   * present in an sr-only span (static, so no hydration mismatch), and the
   * animated copy is marked decorative so screen readers do not read it twice.
   */
  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayed}
        {showCursor && (
          <motion.span
            className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}
      </span>
    </span>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const particlesY = useTransform(scrollYProgress, [0, 1], [0, -250]);

  /*
   * Seeded, not Math.random(): the server prerender and the client hydration
   * each called Math.random() and produced different left/top/size values,
   * which is the hydration mismatch React was reporting. A fixed seed makes
   * both passes emit identical markup.
   */
  const orbs = useMemo(
    () => {
      let seed = 0x9e3779b9;
      const rand = () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
      /*
       * LOADER_MS offsets every orb's start past the entrance overlay. These 20
       * infinite animations used to begin at mount — running, invisible, behind
       * the loader — and competed with it for frames during hydration, which is
       * exactly when the browser is busiest. Nothing is lost visually: they were
       * hidden until the curtain cleared anyway.
       */
      const LOADER_MS = 1.9;
      return Array.from({ length: 20 }, (_, i) => ({ id: i, x: 5 + rand() * 90, y: 15 + rand() * 70, size: 3 + rand() * 6, delay: LOADER_MS + rand() * 6, duration: 4 + rand() * 5 }));
    },
    []
  );

  return (
    <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center px-6 pt-20 overflow-hidden">
      {/* Background orbs */}
      <motion.div style={{ y: orb1Y }} className="orb bg-accent opacity-[0.05] w-[600px] h-[600px] top-[-200px] right-[-150px]" />
      <motion.div style={{ y: orb2Y }} className="orb bg-neon opacity-[0.03] w-[500px] h-[500px] bottom-[-150px] left-[-100px]" />

      {/* Particles */}
      <motion.div style={{ y: particlesY }} className="absolute inset-0 pointer-events-none">
        {orbs.map((o) => <FloatingOrb key={o.id} {...o} />)}
      </motion.div>

      <div className="max-w-6xl w-full mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left - Text */}
          <motion.div style={{ y: textY, opacity: contentOpacity }} variants={container} initial="hidden" animate="visible" className="flex-1 min-w-0 w-full">
            {/* Hello text */}
            <motion.p variants={item} className="text-text-muted font-mono text-sm tracking-wider mb-2">
              Hello, I am
            </motion.p>

            {/* First name - massive */}
            {/*
              One h1 for the whole name. It used to be two — one per line —
              which gives the page two top-level headings; search engines and
              screen readers both expect a single h1. The lines are now spans,
              and aria-label carries the readable name because each glyph is
              split into its own element for the hover animation.
            */}
            <motion.h1
              variants={item}
              aria-label="Kavishka Deshan"
              className="font-black leading-[0.85] tracking-tight mb-8 max-w-full break-words"
              style={{ fontSize: "clamp(2.35rem, 11.5vw, 8rem)" }}
            >
              <span className="block">
                <AnimatedName text="KAVISHKA" />
              </span>
              {/* Real space: without it the two blocks concatenate and a crawler
                  reads the heading as "KAVISHKADESHAN". */}
              {" "}
              <span className="block">
                <AnimatedName text="DESHAN" outline />
              </span>
            </motion.h1>

            {/* Subtitle with typing effect */}
            <motion.p variants={item} className="text-xl md:text-2xl mb-4">
              A <span className="text-accent font-semibold glow-text"><TypingText text="Fullstack Developer" delay={800} /></span>
            </motion.p>
            <motion.p variants={item} className="text-xl md:text-2xl text-text-muted mb-6">
              <TypingText text="Web & Software Engineer" delay={1800} />
            </motion.p>

            {/* Description */}
            <motion.p variants={item} className="text-text-muted text-base leading-relaxed mb-10 max-w-lg">
              Software Engineering undergraduate at NIBM, Sri Lanka. I design and build modern web
              applications, from polished interfaces to fast, secure, and scalable backend systems.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={item} className="flex items-center gap-4 mb-10">
              <motion.a
                href="#projects"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-bg font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:scale-[1.02]"
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
              >
                View Projects
                <ArrowRight size={16} />
              </motion.a>
              <motion.a
                href="#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border text-text font-semibold text-sm transition-all duration-300 hover:border-accent/40 hover:text-accent"
                whileHover={{ scale: [1, 1.02, 1] }}
                whileTap={{ scale: 0.97 }}
              >
                Contact Me
              </motion.a>
            </motion.div>

            {/* Social icons */}
            <motion.div variants={item} className="flex items-center gap-4">
              {[
                { icon: <Linkedin size={20} />, href: site.linkedin, label: "LinkedIn" },
                { icon: <Github size={20} />, href: site.github, label: "GitHub" },
                { icon: <Instagram size={20} />, href: site.instagram, label: "Instagram" },
                { icon: <Send size={20} />, href: site.telegram, label: "Telegram" },
              ].map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 rounded-full border border-border bg-bg-card flex items-center justify-center text-text-muted hover:text-white hover:border-accent/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.08, duration: 0.5 }}
                >
                  {social.icon}
                  <div className="absolute inset-0 rounded-full bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Photo */}
          <motion.div
            style={{ y: photoY }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            /* Was `hidden lg:block` — the portrait did not render at all on
               phones or most tablets. It is visible at every width now, with the
               entrance x-offset only applied where there is room for it. */
            className="flex-shrink-0 relative order-first lg:order-none mb-4 lg:mb-0"
          >
            {/* Ambient bloom */}
            <motion.div
              className="absolute inset-[-28px] lg:inset-[-50px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 16%, transparent) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Conic halo, slowly sweeping */}
            <motion.div
              className="absolute inset-[-14px] rounded-full pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb, var(--color-accent) 55%, transparent) 60deg, transparent 140deg, transparent 220deg, color-mix(in srgb, var(--color-neon-bright) 40%, transparent) 290deg, transparent 360deg)",
                maskImage: "radial-gradient(circle, transparent 63%, #000 65%, #000 100%)",
                WebkitMaskImage: "radial-gradient(circle, transparent 63%, #000 65%, #000 100%)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            />

            {/* Dashed orbit + travelling node */}
            <motion.div
              className="absolute inset-[-16px] lg:inset-[-26px] rounded-full pointer-events-none"
              style={{
                border: "1px dashed color-mix(in srgb, var(--color-accent) 22%, transparent)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_14px_var(--color-accent)]" />
            </motion.div>

            {/* Counter-rotating inner ring */}
            <motion.div
              className="absolute inset-[-6px] rounded-full pointer-events-none"
              style={{
                border: "1px solid color-mix(in srgb, var(--color-accent) 16%, transparent)",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-neon-bright shadow-[0_0_10px_var(--color-neon-bright)]" />
            </motion.div>

            {/*
              Photo. `group` drives the hover state so the portrait, its inner
              lighting and the two overlays can all react together.
            */}
            <motion.div
              className="photo-frame group relative w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-full overflow-hidden bg-bg-card cursor-pointer"
              style={{
                border: "2px solid color-mix(in srgb, var(--color-accent) 28%, transparent)",
                boxShadow:
                  "0 24px 70px rgba(0,0,0,0.45), 0 0 60px color-mix(in srgb, var(--color-accent) 14%, transparent), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
              whileHover={{ scale: 1.035 }}
            >
              {/* The portrait itself zooms slightly inside the fixed frame */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <Image
                  src={site.photo}
                  alt="Kavishka Deshan, Software Engineering undergraduate and fullstack developer"
                  width={320}
                  height={320}
                  priority
                  className="photo-frame__img object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              {/* Key light from the top-left, warms up on hover */}
              <div
                className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-700 opacity-70 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 28% 22%, color-mix(in srgb, var(--color-accent) 16%, transparent) 0%, transparent 62%)",
                }}
              />

              {/* Contact shadow so the portrait sits in the frame rather than floating on it */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  boxShadow:
                    "inset 0 -30px 60px -20px rgba(0,0,0,0.75), inset 0 12px 30px -18px rgba(255,255,255,0.16)",
                }}
              />

              {/* Grounding shade at the base */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1/3 z-10 pointer-events-none transition-opacity duration-700 group-hover:opacity-70"
                style={{ background: "linear-gradient(to top, rgba(10,5,20,0.6) 0%, transparent 100%)" }}
              />

              {/* Glass sheen sweeping across the portrait */}
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.16) 50%, transparent 62%)",
                }}
                animate={{ x: ["-130%", "130%"] }}
                transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Availability pill — top right of the portrait */}
            <motion.div
              className="absolute -top-1 -right-2 sm:-right-8 lg:-right-16 z-30 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-bg-card/90 backdrop-blur-sm whitespace-nowrap"
              style={{
                border: "1px solid color-mix(in srgb, var(--color-accent) 26%, transparent)",
                boxShadow: "0 8px 26px rgba(0,0,0,0.4), 0 0 20px color-mix(in srgb, var(--color-accent) 16%, transparent)",
              }}
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: [0, -6, 0] }}
              transition={{ opacity: { delay: 1.2 }, y: { duration: 2.8, repeat: Infinity, delay: 1.2 } }}
            >
              <span className="relative flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </span>
              <span className="text-[10px] font-semibold text-accent tracking-[0.14em] uppercase">
                Available for work
              </span>
            </motion.div>

            {/* Code card — bottom left of the portrait */}
            <motion.div
              className="absolute -bottom-2 -left-2 sm:-left-8 lg:-left-14 z-30 px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-bg-card/92 backdrop-blur-md font-mono text-[10px] sm:text-[11px] leading-relaxed whitespace-nowrap"
              style={{
                border: "1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)",
                boxShadow: "0 12px 34px rgba(0,0,0,0.45)",
              }}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0, y: [0, 7, 0] }}
              transition={{
                opacity: { delay: 1.4 },
                x: { delay: 1.4 },
                y: { duration: 3.4, repeat: Infinity, delay: 1.4 },
              }}
            >
              {/* Accent spine */}
              <span className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full bg-accent/60" />
              <div className="pl-2">
                <div className="text-text-dim">&lt;fullstack-developer&gt;</div>
                <div className="text-text font-semibold">ideas.intoReality()</div>
                <div className="text-text-dim">&lt;/fullstack-developer&gt;</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="flex flex-col items-center gap-2">
          <span className="text-text-dim text-[10px] font-mono tracking-[3px] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-5 h-8 rounded-full border border-border flex items-center justify-center bg-bg-card">
            <motion.div className="w-1 h-1.5 rounded-full bg-accent" animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
