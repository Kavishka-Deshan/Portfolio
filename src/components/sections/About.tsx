"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import AnimatedSection from "@/components/effects/AnimatedSection";
import { Download } from "lucide-react";

/*
 * Soft keystrokes, synthesised rather than sampled (keeps the static export
 * dependency-free and avoids shipping audio files).
 *
 * Tuned as a quiet membrane/laptop key rather than a clicky mechanical one:
 * the noise transient is centred low (~950Hz, not 2.6kHz), everything runs
 * through a low-pass, the attack is eased rather than instant, and the overall
 * level is roughly a third of the previous version. Small random jitter keeps
 * repeated keys from sounding identical.
 */
const keyboard = (() => {
  let ctx: AudioContext | null = null;
  let noise: AudioBuffer | null = null;

  const context = () => {
    if (typeof window === "undefined") return null;
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    // Browsers start the context suspended until a user gesture.
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  };

  const noiseBuffer = (c: AudioContext) => {
    if (!noise) {
      const len = Math.floor(c.sampleRate * 0.12);
      noise = c.createBuffer(1, len, c.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    return noise;
  };

  const strike = (opts: { gain: number; clickHz: number; thockHz: number; clickMs: number; thockMs: number }) => {
    try {
      const c = context();
      if (!c) return;
      const t = c.currentTime;
      const jitter = 0.9 + Math.random() * 0.2;

      // Shared low-pass: rolls off the brittle top end of both layers.
      const lp = c.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1500;
      lp.Q.value = 0.5;
      lp.connect(c.destination);

      // --- key contact: soft, low-centred noise transient ---
      const src = c.createBufferSource();
      src.buffer = noiseBuffer(c);
      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = opts.clickHz * jitter;
      bp.Q.value = 0.7;
      const clickGain = c.createGain();
      clickGain.gain.setValueAtTime(0.0001, t);
      clickGain.gain.linearRampToValueAtTime(opts.gain, t + 0.004); // eased, not instant
      clickGain.gain.exponentialRampToValueAtTime(0.0001, t + opts.clickMs / 1000);
      src.connect(bp).connect(clickGain).connect(lp);
      src.start(t);
      src.stop(t + opts.clickMs / 1000);

      // --- cushioned body underneath ---
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(opts.thockHz * jitter, t);
      osc.frequency.exponentialRampToValueAtTime(opts.thockHz * 0.7, t + opts.thockMs / 1000);
      const thockGain = c.createGain();
      thockGain.gain.setValueAtTime(0.0001, t);
      thockGain.gain.linearRampToValueAtTime(opts.gain * 0.6, t + 0.006);
      thockGain.gain.exponentialRampToValueAtTime(0.0001, t + opts.thockMs / 1000);
      osc.connect(thockGain).connect(lp);
      osc.start(t);
      osc.stop(t + opts.thockMs / 1000);
    } catch {
      /* audio is decorative -- never let it break the typing */
    }
  };

  return {
    key: () => strike({ gain: 0.016, clickHz: 950, thockHz: 140, clickMs: 26, thockMs: 55 }),
    // Line end: a touch fuller, still soft
    enter: () => strike({ gain: 0.024, clickHz: 760, thockHz: 105, clickMs: 34, thockMs: 85 }),
  };
})();

const typeClick = keyboard.key;
const lineCompleteSound = keyboard.enter;

const codeLines = [
  { type: "keyword", parts: [{ text: "const ", color: "text-purple-400" }, { text: "developer", color: "text-white" }, { text: " ", color: "text-white" }, { text: "=", color: "text-pink-400" }, { text: " ", color: "text-white" }, { text: "{", color: "text-yellow-300" }] },
  { type: "prop", parts: [{ text: "  ", color: "text-white" }, { text: "name", color: "text-blue-300" }, { text: ": ", color: "text-white" }, { text: "'Kavishka Deshan'", color: "text-emerald-400" }, { text: ",", color: "text-white" }] },
  { type: "prop", parts: [{ text: "  ", color: "text-white" }, { text: "role", color: "text-blue-300" }, { text: ": ", color: "text-white" }, { text: "'Full-stack Developer'", color: "text-emerald-400" }, { text: ",", color: "text-white" }] },
  { type: "prop", parts: [{ text: "  ", color: "text-white" }, { text: "education", color: "text-blue-300" }, { text: ": ", color: "text-white" }, { text: "'HND Software Engineering'", color: "text-emerald-400" }, { text: ",", color: "text-white" }] },
  { type: "prop", parts: [{ text: "  ", color: "text-white" }, { text: "university", color: "text-blue-300" }, { text: ": ", color: "text-white" }, { text: "'NIBM, Sri Lanka'", color: "text-emerald-400" }, { text: ",", color: "text-white" }] },
  { type: "close", parts: [{ text: "}", color: "text-yellow-300" }] },
];

function TypingCodeLine({ line, lineNum, shouldStart, onComplete }: { line: typeof codeLines[0]; lineNum: number; shouldStart: boolean; onComplete?: () => void }) {
  const fullText = line.parts.map((p) => p.text).join("");
  const [displayedLen, setDisplayedLen] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!shouldStart) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedLen(i);
      typeClick();
      if (i >= fullText.length) {
        clearInterval(interval);
        setDone(true);
        lineCompleteSound();
        onComplete?.();
      }
    }, 28);
    return () => clearInterval(interval);
  }, [shouldStart, fullText, onComplete]);

  // Build displayed parts
  let remaining = displayedLen;
  const displayedParts = line.parts.map((part) => {
    if (remaining <= 0) return null;
    const show = Math.min(remaining, part.text.length);
    remaining -= show;
    return { text: part.text.slice(0, show), color: part.color };
  }).filter(Boolean) as { text: string; color: string }[];

  const isTyping = shouldStart && !done;

  return (
    <motion.div
      className="relative flex gap-5 items-start -mx-3 px-3 py-0.5 rounded-lg"
      animate={isTyping ? {
        backgroundColor: ["rgba(168,85,247,0)", "rgba(168,85,247,0.06)", "rgba(168,85,247,0.03)"],
        boxShadow: ["0 0 0px rgba(168,85,247,0)", "0 0 15px rgba(168,85,247,0.08)", "0 0 8px rgba(168,85,247,0.04)"],
      } : {
        backgroundColor: "rgba(168,85,247,0)",
        boxShadow: "0 0 0px rgba(168,85,247,0)",
      }}
      transition={isTyping ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
    >
      {/* Active line left accent */}
      {isTyping && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full bg-accent"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: [0.4, 1, 0.4] }}
          transition={{ scaleY: { duration: 0.2 }, opacity: { duration: 1.5, repeat: Infinity } }}
        />
      )}

      {/* Line number */}
      <div className="flex items-center gap-2 w-5 justify-end">
        <span className={`select-none text-xs leading-loose mt-px transition-colors duration-300 ${isTyping ? "text-accent" : "text-text-dim"}`}>
          {String(lineNum).padStart(2, "0")}
        </span>
      </div>

      {/* Code text */}
      <span className="leading-loose whitespace-pre">
        {displayedParts.map((p, i) => (
          <span key={i} className={p.color}>{p.text}</span>
        ))}
        {isTyping && (
          <motion.span
            className="inline-block w-[2px] h-[1em] bg-accent ml-px align-middle rounded-full"
            animate={{ opacity: [1, 0], scaleY: [1, 0.8, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
        {done && (
          <motion.span
            className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 ml-2 align-middle"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          />
        )}
      </span>
    </motion.div>
  );
}

const themeGradients: Record<string, string> = {
  dark: "linear-gradient(90deg, #a855f7, #e879f9, #c084fc)",
  light: "linear-gradient(90deg, #1a8a00, #22a500, #32cd32)",
  cyber: "linear-gradient(90deg, #a3ff00, #c8ff44, #b8ff33)",
};

export default function About() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orbY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.2]);
  const progressScale = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const [codeStarted, setCodeStarted] = useState(false);
  // Sequential typing: each line starts only once the previous one finishes,
  // so the object types out top-to-bottom in order. (Previously each line was
  // gated on a scroll-position threshold, so lines fired out of step -- or all
  // at once -- depending on how fast you scrolled.)
  const [typedCount, setTypedCount] = useState(0);
  const handleLineComplete = useCallback(() => setTypedCount((n) => n + 1), []);

  return (
    <section ref={sectionRef} id="about" className="relative py-32 px-6 overflow-hidden">
      {/* Parallax orb */}
      <motion.div
        style={{ y: orbY, scale: orbScale }}
        className="orb bg-accent opacity-[0.03] w-[400px] h-[400px] top-[-100px] left-[-120px]"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <AnimatedSection animation="blurIn">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-5">
              About <span className="text-gradient">Me</span>
            </h2>
            {/* Decorative line */}
            <div className="flex items-center justify-center gap-0 mb-6">
              <div className="w-12 h-[1px] bg-accent/40" />
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-accent mx-3"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="w-12 h-[1px] bg-accent/40" />
            </div>
            <p className="text-text-muted text-base md:text-lg max-w-xl mx-auto">
              Turning business requirements into reliable digital products.
            </p>
          </div>
        </AnimatedSection>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-14 items-center">
          {/* Left: Code Editor Card */}
          <div className="lg:w-[55%] w-full">
            <AnimatedSection animation="fadeLeft" delay={0.15}>
              <motion.div
                className="code-panel relative rounded-2xl border bg-bg-card overflow-hidden"
                style={{ transformPerspective: 1200 }}
                /*
                 * Only numeric/transform props are animated here. Framer cannot
                 * parse `color-mix()` inside an animated boxShadow -- doing so
                 * threw inside the viewport callback and stopped
                 * onViewportEnter from ever firing, which left the panel at
                 * opacity 0 and the typing never started. The theme-aware glow
                 * and hover state live in CSS (.code-panel) instead.
                 */
                initial={{ opacity: 0, y: 44, rotateX: 12, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                onViewportEnter={() => setCodeStarted(true)}
                viewport={{ once: true, amount: 0.3 }}
              >
                {/* Accent sheen that sweeps across once the panel lands */}
                <motion.div
                  className="absolute inset-0 z-20 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 35%, color-mix(in srgb, var(--color-accent) 22%, transparent) 50%, transparent 65%)",
                  }}
                  initial={{ x: "-130%" }}
                  whileInView={{ x: "130%" }}
                  transition={{ duration: 1.4, ease: "easeInOut", delay: 0.5 }}
                  viewport={{ once: true, amount: 0.3 }}
                />
                {/* Scroll progress bar */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[2px] z-20 origin-left"
                  style={{
                    scaleX: progressScale,
                    background: themeGradients[theme] || themeGradients.dark,
                  }}
                />
                {/* Glow top edge */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

                {/* Title bar */}
                <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border/60 bg-bg-panel/50 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-[0_0_6px_rgba(255,95,87,0.4)]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-[0_0_6px_rgba(254,188,46,0.4)]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-[0_0_6px_rgba(40,200,64,0.4)]" />
                  </div>
                  <span className="ml-3 text-text-dim text-xs font-mono tracking-wide">developer.ts</span>
                </div>

                {/* Code content with dot pattern bg */}
                <div className="relative p-6 font-mono text-sm min-h-[220px]">
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(168,85,247,0.04) 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                  <AnimatePresence>
                    {codeStarted && codeLines.map((line, i) => (
                      <TypingCodeLine
                        key={i}
                        line={line}
                        lineNum={i + 1}
                        shouldStart={codeStarted && i <= typedCount}
                        onComplete={handleLineComplete}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Bottom glow line */}
                <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              </motion.div>
            </AnimatedSection>
          </div>

          {/* Right: Bio + CV */}
          <div className="lg:w-[45%] w-full">
            <AnimatedSection animation="fadeRight" delay={0.3}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-text mb-1">
                    Hi there! 👋
                  </h3>
                  <div className="w-10 h-[2px] bg-accent mt-3 mb-5" />
                </div>

                <p className="text-text-muted text-sm md:text-base leading-relaxed">
                  I am <span className="text-text font-medium">Kavishka Deshan</span>, a Full-stack Developer
                  passionate about end-to-end application development. I enjoy designing
                  responsive interfaces backed by solid databases and deployments.
                </p>
                <p className="text-text-muted text-sm md:text-base leading-relaxed">
                  I am currently studying <span className="text-accent font-medium">Software Engineering</span> at
                  NIBM, Sri Lanka. I work with React, TypeScript, Flutter, Node.js,
                  Firebase, and Supabase, backed by PostgreSQL and MySQL.
                </p>
                <p className="text-text-muted text-sm md:text-base leading-relaxed">
                  I believe that software should be clean, secure, modern, and provide a
                  great user experience.
                </p>

                {/* CV Button */}
                <motion.div
                  className="pt-2"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <motion.a
                    href="/Kavishka_Deshan_CV.pdf"
                    download
                    className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl border border-border text-text font-semibold text-sm transition-all duration-300 hover:border-accent/50 hover:text-accent hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Download CV
                    <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                  </motion.a>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
