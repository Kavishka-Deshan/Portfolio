"use client";

export default function Scanlines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[45]">
      {/* Static scanlines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, var(--color-accent) 8%, transparent) 2px, color-mix(in srgb, var(--color-accent) 8%, transparent) 4px)",
        }}
      />

      {/*
        The travelling sweep.
        - Colours come from the theme tokens, so it is purple / green / lime
          instead of always purple.
        - It runs as a CSS keyframe on `transform`, not `top`. Animating `top`
          forced a full-page layout every frame. It is CSS rather than Framer
          because Framer cannot interpolate `y` from a px number to "100vh" --
          the units differ, so it silently never moved.
      */}
      <div
        className="scan-sweep absolute left-0 right-0 top-0 h-[2px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-accent) 18%, transparent), color-mix(in srgb, var(--color-neon-bright) 12%, transparent), transparent)",
          boxShadow:
            "0 0 20px color-mix(in srgb, var(--color-accent) 12%, transparent), 0 0 40px color-mix(in srgb, var(--color-accent) 6%, transparent)",
        }}
      />

      {/* Vignette — tinted from the page background so it works on light too */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, color-mix(in srgb, var(--color-bg) 55%, transparent) 100%)",
        }}
      />
    </div>
  );
}
