"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { ArrowUpRight, Github, Sparkles, Check } from "lucide-react";
import { projects, site, type Project } from "@/content/portfolio";
import AnimatedSection from "@/components/effects/AnimatedSection";
import TiltCard from "@/components/ui/TiltCard";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, on: false });

  // Cursor-tracked spotlight; percentages so it survives any card size.
  const onMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
      on: true,
    });
  }, []);

  return (
    <TiltCard>
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={() => setSpot((s) => ({ ...s, on: false }))}
        className="group relative rounded-3xl overflow-hidden transition-colors duration-500"
        style={{
          background: "color-mix(in srgb, var(--color-bg-card) 88%, transparent)",
          border: "1px solid color-mix(in srgb, var(--color-border) 90%, transparent)",
        }}
      >
        {/* Gradient rim that lights up on hover */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            padding: 1,
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 55%, transparent), transparent 45%, color-mix(in srgb, var(--color-neon-bright) 35%, transparent))",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Cursor spotlight */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: spot.on ? 1 : 0,
            background: `radial-gradient(600px circle at ${spot.x}% ${spot.y}%, color-mix(in srgb, var(--color-accent) 9%, transparent), transparent 42%)`,
          }}
        />

        {/* Oversized index digit */}
        <div className="absolute -top-4 right-6 font-mono text-[7rem] md:text-[9rem] font-bold leading-none select-none pointer-events-none text-text-dim/10 group-hover:text-accent/15 transition-colors duration-500">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="relative z-10 p-8 md:p-11">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {project.flagship && (
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide"
                style={{
                  background: "color-mix(in srgb, var(--color-accent) 16%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--color-accent) 38%, transparent)",
                  color: "var(--color-accent)",
                }}
              >
                <Sparkles size={12} />
                Flagship
              </span>
            )}
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-dim">
              {project.type}
            </span>
          </div>

          <h3 className="text-2xl md:text-[2rem] font-bold text-text leading-tight mb-4 group-hover:text-accent transition-colors duration-300">
            {project.title}
          </h3>

          <p className="text-text-muted max-w-2xl leading-relaxed mb-7">{project.summary}</p>

          {/* Highlights — this data was already in portfolio.ts but unused */}
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5 mb-8 max-w-3xl">
            {project.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-text-muted">
                <Check size={15} className="mt-0.5 shrink-0 text-accent/70" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* Stack */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.stack.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-text-muted border border-border transition-all duration-300 hover:text-accent"
                style={{ background: "color-mix(in srgb, var(--color-bg) 60%, transparent)" }}
              >
                {tag}
              </span>
            ))}
          </div>

          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium text-text-muted border border-border hover:text-accent transition-all duration-300"
              style={{ background: "color-mix(in srgb, var(--color-bg) 55%, transparent)" }}
            >
              <Github size={16} />
              View source
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </a>
          )}
        </div>
      </div>
    </TiltCard>
  );
}

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 300]);

  return (
    <section ref={containerRef} id="projects" className="relative py-32 overflow-hidden">
      {/* Parallax background orbs */}
      <motion.div
        className="absolute top-20 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl pointer-events-none"
        style={{ y: orbY1 }}
      />
      <motion.div
        className="absolute bottom-20 -right-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none"
        style={{ y: orbY2 }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimatedSection animation="blurIn">
          <div className="text-center mb-20">
            <span className="font-mono text-accent text-sm tracking-[0.3em] mb-4 block uppercase">
              Portfolio
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-5">
              Featured <span className="text-gradient">Work</span>
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
            <p className="text-text-muted text-base md:text-lg max-w-xl mx-auto">
              Projects built end to end — from data model and API through to the interface.
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-8">
          {projects.map((project, i) => (
            <AnimatedSection key={project.title} delay={i * 0.1}>
              <ProjectCard project={project} index={i} />
            </AnimatedSection>
          ))}
        </div>

        {/* Explore more on GitHub */}
        <AnimatedSection animation="fadeUp" delay={0.3}>
          <div className="mt-16 text-center">
            <a
              href={`${site.github}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-border bg-bg-card hover:border-accent/40 hover:bg-accent/5 transition-all duration-300"
            >
              <Github size={18} className="text-text-muted group-hover:text-accent transition-colors" />
              <span className="text-text-muted group-hover:text-accent font-medium transition-colors">
                Explore more on GitHub
              </span>
              <ArrowUpRight
                size={16}
                className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
              />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
