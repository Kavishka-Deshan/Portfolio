"use client";

import { useRef } from "react";
import { education, languages } from "@/content/portfolio";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedSection from "@/components/effects/AnimatedSection";
import { GraduationCap, BookOpen, Globe, Award } from "lucide-react";

export default function Education() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orbY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1.15]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [60, -120]);

  return (
    <section ref={sectionRef} id="education" className="relative py-unit-5 px-6 overflow-hidden bg-bg">
      {/* Parallax orb */}
      <motion.div
        style={{ y: orbY, scale: orbScale }}
        className="orb bg-accent opacity-[0.04] w-[500px] h-[500px] top-[-100px] left-[-200px]"
      />
      <motion.div
        style={{ y: orb2Y }}
        className="orb bg-accent opacity-[0.02] w-[350px] h-[350px] bottom-[-100px] right-[-150px]"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatedSection animation="blurIn">
          <span className="font-mono text-accent text-sm tracking-[0.3em] mb-4 block uppercase">
            Education
          </span>
        </AnimatedSection>

        <AnimatedSection animation="fadeUp" delay={0.1} className="mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-text mb-4">
            Academic <span className="text-gradient">Background</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl">
            Building a strong foundation in software engineering through structured learning and hands-on projects.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Main Education Card */}
          <AnimatedSection animation="fadeUp" delay={0.15} className="lg:col-span-2">
            <div className="card-premium p-8 md:p-10 rounded-3xl relative overflow-hidden h-full group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 pointer-events-none group-hover:bg-accent/8 transition-colors duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl border border-border bg-bg flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Current Program</span>
                    <h3 className="text-xl font-bold text-text">{education.programme}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl border border-border bg-bg/50">
                  <Award size={18} className="text-accent flex-shrink-0" />
                  <p className="text-text-muted text-sm">{education.institution}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={14} className="text-accent" />
                    <span className="text-xs font-mono text-text-muted uppercase tracking-[2px]">Key Coursework</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {education.coursework.map((course) => (
                      <span
                        key={course}
                        className="text-sm text-text-muted bg-bg border border-border rounded-full px-4 py-2 hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-all duration-300 cursor-default"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Side Cards */}
          <div className="space-y-6">
            {/* Languages Card */}
            <AnimatedSection animation="fadeRight" delay={0.2}>
              <div className="card-premium p-6 rounded-3xl relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-[60px] translate-y-1/3 translate-x-1/3 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl border border-border bg-bg flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Globe size={20} />
                  </div>
                  <h4 className="text-sm font-mono text-text-muted uppercase tracking-wider mb-3">Languages</h4>
                  <div className="space-y-2">
                    {languages.map((lang) => (
                      <div key={lang} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="text-sm text-text">{lang}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Quick Stats */}
            <AnimatedSection animation="fadeRight" delay={0.25}>
              <div className="card-premium p-6 rounded-3xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl border border-border bg-bg flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen size={20} />
                  </div>
                  <h4 className="text-sm font-mono text-text-muted uppercase tracking-wider mb-4">Highlights</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-muted">Coursework</span>
                      <span className="text-sm font-bold text-accent">{education.coursework.length}</span>
                    </div>
                    <div className="w-full h-px bg-border" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-muted">Languages</span>
                      <span className="text-sm font-bold text-accent">{languages.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
