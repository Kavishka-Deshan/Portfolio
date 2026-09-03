"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedSection from "@/components/effects/AnimatedSection";
import { skillLogos } from "@/components/ui/SkillLogos";

const skillCards = [
  { name: "HTML5 & CSS3", category: "Frontend Core", color: "#e34c26", bg: "rgba(227,76,38,0.12)", tooltip: "Semantic markup, Flexbox, Grid, animations" },
  { name: "JavaScript", category: "Programming Language", color: "#f7df1e", bg: "rgba(247,223,30,0.12)", tooltip: "ES6+, async/await, DOM, functional programming" },
  { name: "TypeScript", category: "Typed JavaScript", color: "#3178c6", bg: "rgba(49,120,198,0.12)", featured: true, tooltip: "Static typing, generics, interfaces, strict mode" },
  { name: "React", category: "Frontend Library", color: "#61dafb", bg: "rgba(97,218,251,0.12)", tooltip: "Hooks, context, state management, JSX" },
  { name: "Tailwind CSS", category: "CSS Framework", color: "#06b6d4", bg: "rgba(6,182,212,0.12)", tooltip: "Utility-first, responsive design, dark mode" },
  { name: "Node.js", category: "Backend Runtime", color: "#68a063", bg: "rgba(104,160,99,0.12)", tooltip: "Event-driven, streams, modules, npm ecosystem" },
  { name: "Firebase", category: "Backend Platform", color: "#ffca28", bg: "rgba(255,202,40,0.12)", tooltip: "Firestore, Auth, Cloud Functions, hosting" },
  { name: "Supabase", category: "Backend Platform", color: "#3ecf8e", bg: "rgba(62,207,142,0.12)", tooltip: "Postgres, Auth, realtime, storage, edge functions" },
  { name: "Flutter", category: "Mobile Framework", color: "#02569b", bg: "rgba(2,86,155,0.12)", tooltip: "Dart, widgets, state management, cross-platform" },
  { name: "Java", category: "Programming Language", color: "#f89820", bg: "rgba(248,152,32,0.12)", tooltip: "OOP, collections, multithreading, Spring" },
  { name: "Python", category: "Programming Language", color: "#3776ab", bg: "rgba(55,118,171,0.12)", tooltip: "Scripts, data processing, Flask, Django" },
  { name: "C#", category: "Programming Language", color: "#9b4f96", bg: "rgba(155,79,150,0.14)", tooltip: ".NET, OOP, LINQ, desktop and backend apps" },
  { name: "C", category: "Systems Language", color: "#5c8dbc", bg: "rgba(92,141,188,0.14)", tooltip: "Pointers, memory management, embedded firmware" },
  { name: "PostgreSQL", category: "Relational Database", color: "#4169e1", bg: "rgba(65,105,225,0.12)", tooltip: "SQL queries, joins, indexes, migrations" },
  { name: "MySQL", category: "Relational Database", color: "#00758f", bg: "rgba(0,117,143,0.14)", tooltip: "Schema design, joins, stored procedures, tuning" },
  { name: "Git & GitHub", category: "Version Control", color: "#f05032", bg: "rgba(240,80,50,0.12)", tooltip: "Branching, PRs, CI/CD, collaboration workflows" },
];

const SkillIcon = ({ name, color, isHovered }: { name: string; color: string; isHovered: boolean }) => (
  <div className="relative w-9 h-9" style={{ transformStyle: "preserve-3d" }}>
    {/* Coloured bloom that lifts the mark off the card on hover */}
    <motion.div
      className="absolute inset-0 rounded-xl blur-lg"
      style={{ backgroundColor: color }}
      animate={{ opacity: isHovered ? 0.55 : 0.18, scale: isHovered ? 1.15 : 0.9 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    />

    {/* Glass tile the logo sits on */}
    <motion.div
      className="absolute inset-0 rounded-xl border border-white/10 overflow-hidden"
      style={{
        background: `linear-gradient(145deg, ${color}2e, ${color}0d)`,
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX: isHovered ? -14 : 0,
        rotateY: isHovered ? 14 : 0,
        boxShadow: isHovered
          ? `0 10px 22px ${color}55, inset 0 1px 0 rgba(255,255,255,0.35)`
          : `0 4px 10px ${color}22, inset 0 1px 0 rgba(255,255,255,0.15)`,
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Specular sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.42) 48%, transparent 62%)",
        }}
        animate={{ x: isHovered ? ["-120%", "120%"] : "-120%" }}
        transition={isHovered ? { duration: 0.85, ease: "easeInOut" } : { duration: 0.2 }}
      />
    </motion.div>

    {/* The mark itself, floating above the tile */}
    <motion.div
      className="absolute inset-0 flex items-center justify-center p-[7px]"
      animate={{
        rotateX: isHovered ? -14 : 0,
        rotateY: isHovered ? 14 : 0,
        z: isHovered ? 26 : 0,
        scale: isHovered ? 1.1 : 1,
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {skillLogos[name] ?? (
        <div className="w-full h-full rounded-md" style={{ backgroundColor: color }} />
      )}
    </motion.div>
  </div>
);

function SkillCard({ skill, index }: { skill: typeof skillCards[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleId = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleId.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700);
  }, []);

  return (
    <AnimatedSection animation="fadeUp" delay={index * 0.04}>
      <motion.div
        ref={cardRef}
        className="relative group cursor-default overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        /*
         * `perspective` makes this card its own stacking context, so the
         * tooltip's own z-index only competes inside the card. Without lifting
         * the whole card, a neighbour painted later in the grid (or the
         * featured card, which sits at z-10) covers the tooltip. Raise the card
         * itself while hovered so its tooltip clears every sibling.
         */
        style={{
          perspective: "800px",
          zIndex: isHovered ? 50 : skill.featured ? 10 : undefined,
        }}
      >
        {/* Tooltip */}
        <motion.div
          className="absolute -top-[3.25rem] left-1/2 px-3 py-2 rounded-xl border text-[11px] font-mono whitespace-nowrap z-30 pointer-events-none"
          style={{
            x: "-50%",
            transformOrigin: "bottom center",
            background: "color-mix(in srgb, var(--color-bg-card) 92%, transparent)",
            borderColor: `${skill.color}55`,
            color: "var(--color-text)",
            backdropFilter: "blur(10px)",
            boxShadow: `0 10px 30px rgba(0,0,0,0.35), 0 0 22px ${skill.color}33`,
          }}
          initial={false}
          animate={
            isHovered
              ? { opacity: 1, y: 0, scale: 1, rotateX: 0 }
              : { opacity: 0, y: 10, scale: 0.92, rotateX: -35 }
          }
          transition={{ type: "spring", stiffness: 420, damping: 26, mass: 0.7 }}
        >
          <span className="flex items-center gap-2">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: skill.color, boxShadow: `0 0 8px ${skill.color}` }}
            />
            {skill.tooltip}
          </span>
          {/* Tooltip arrow */}
          <span
            className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2.5 h-2.5 rotate-45 border-r border-b"
            style={{
              background: "color-mix(in srgb, var(--color-bg-card) 92%, transparent)",
              borderColor: `${skill.color}55`,
            }}
          />
        </motion.div>

        <motion.div
          onClick={handleClick}
          className={`relative p-4 rounded-xl border bg-bg-card/60 backdrop-blur-md overflow-hidden transition-shadow duration-500 ${
            skill.featured
              ? "border-accent/40 shadow-[0_0_25px_rgba(168,85,247,0.1)]"
              : "border-border hover:border-accent/20"
          }`}
          style={{
            rotateX: tilt.x,
            rotateY: tilt.y,
            transformStyle: "preserve-3d",
          }}
          animate={isHovered ? {
            boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${skill.bg}, inset 0 1px 0 rgba(255,255,255,0.05)`,
          } : {
            boxShadow: "0 4px 15px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Top shine gradient */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
            style={{ background: `radial-gradient(circle at 30% 30%, ${skill.bg}, transparent 70%)` }}
          />

          {/* Click ripples */}
          {ripples.map((r) => (
            <motion.div
              key={r.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: r.x - 30,
                top: r.y - 30,
                width: 60,
                height: 60,
                border: `2px solid ${skill.color}`,
              }}
              initial={{ opacity: 0.6, scale: 0 }}
              animate={{ opacity: 0, scale: 3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          ))}

          {/* Reflection shine on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, transparent 100%)`,
              }}
            />
          )}

          <div className="relative z-10 flex items-center gap-3" style={{ transform: "translateZ(20px)" }}>
            {/* Icon */}                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500"
                    style={{
                      background: `linear-gradient(145deg, ${skill.bg}, rgba(0,0,0,0.2))`,
                      boxShadow: isHovered
                        ? `0 8px 25px ${skill.bg}, 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`
                        : `0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)`,
                      transform: isHovered ? "scale(1.2) rotate(5deg) translateY(-2px)" : "scale(1) rotate(0deg) translateY(0)",
                      border: `1px solid ${isHovered ? skill.color + "40" : "rgba(255,255,255,0.05)"}`,
                    }}
                  >
                    <SkillIcon name={skill.name} color={skill.color} isHovered={isHovered} />
                  </div>

            {/* Text */}
            <div className="min-w-0">
              <h3 className="text-text font-semibold text-sm truncate">{skill.name}</h3>
              <p className="text-text-dim text-[11px] truncate">{skill.category}</p>
            </div>
          </div>

          {/* Featured badge */}
          {skill.featured && (
            <div className="absolute top-2 right-2 z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatedSection>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orbY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={sectionRef} id="skills" className="relative py-32 px-6 overflow-hidden">
      <motion.div style={{ y: orbY }} className="orb bg-accent opacity-[0.03] w-[500px] h-[500px] top-[10%] right-[-200px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <AnimatedSection animation="blurIn">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-5">
              Skills & <span className="text-gradient">Technologies</span>
            </h2>
            <div className="flex items-center justify-center gap-0 mb-6">
              <div className="w-12 h-[1px] bg-accent/40" />
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-accent mx-3"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="w-12 h-[1px] bg-accent/40" />
            </div>
          </div>
        </AnimatedSection>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillCards.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
