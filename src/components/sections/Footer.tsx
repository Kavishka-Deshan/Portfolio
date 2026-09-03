"use client";

import { motion } from "framer-motion";
import { site } from "@/content/portfolio";

/*
 * Fixed year rather than new Date().getFullYear(): in a static export the
 * server baked the build-time year into the HTML while the client read the
 * visitor's clock, so the two disagreed across a new year.
 */
const YEAR = 2026;

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative py-12 px-6 border-t border-border bg-bg-alt overflow-hidden"
    >
      {/* Soft accent wash behind the mark */}
      <div
        className="absolute inset-x-0 -top-24 h-48 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-accent) 10%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center gap-5">
        {/* Monogram */}
        <a
          href="#hero"
          aria-label="Back to top"
          className="font-[family-name:var(--font-logo)] text-lg font-black tracking-tight transition-transform duration-300 hover:scale-110"
        >
          <span className="text-text-dim">&lt;/</span>
          <span className="text-text">K</span>
          <span className="text-accent">D</span>
          <span className="text-text-dim">&gt;</span>
        </a>

        {/* Hairline */}
        <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-text-dim text-center">
          © {YEAR} — Designed &amp; built with{" "}
          <span className="text-accent">passion</span>
        </p>

        <p className="text-[11px] text-text-dim/70 text-center">
          {site.name} · {site.location}
        </p>
      </div>
    </motion.footer>
  );
}
