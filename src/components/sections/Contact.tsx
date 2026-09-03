"use client";

import { useState, useRef } from "react";
import { Mail, Github, Linkedin, Copy, Check, Send, MessageSquare, ArrowRight, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { site } from "@/content/portfolio";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedSection from "@/components/effects/AnimatedSection";

// Web3Forms delivers the message straight to the inbox tied to this key.
// The key is a public submit token by design (it only permits posting to this
// one form), so it is safe to ship in a static build.
const WEB3FORMS_KEY =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "e97ae03d-8e00-477a-acaf-b81dbe4ffe81";

export default function Contact() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakeField, setShakeField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const orb1Scale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1.2]);
  const orb2Scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1.1]);

  const copyToClipboard = async (
    text: string,
    setter: (v: boolean) => void
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch {
      // fallback
    }
  };

  const triggerShake = (fieldName: string) => {
    setShakeField(fieldName);
    setTimeout(() => setShakeField(null), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      triggerShake("name");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      if (!newErrors.name) triggerShake("email");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
      if (!newErrors.name) triggerShake("email");
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      if (!newErrors.name && !newErrors.email) triggerShake("message");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors", {
        description: "Check the highlighted fields below.",
      });
      return;
    }

    setErrors({});

    if (!WEB3FORMS_KEY) {
      toast.error("Contact form is not configured", {
        description: `Email me directly at ${site.email}.`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio message from ${formData.name}`,
          from_name: "Kavishka Deshan Portfolio",
          // replyto makes "Reply" in the inbox go to the visitor, not to
          // Web3Forms. Without it a reply bounces back to the relay.
          replyto: formData.email,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          botcheck: "",
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Message sent!", {
          description: `Thanks ${formData.name}, I'll get back to you soon.`,
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      const reason = err instanceof Error ? err.message : "";
      toast.error("Could not send your message", {
        description: reason
          ? `${reason} — or email me directly at ${site.email}.`
          : `Please try again, or email me directly at ${site.email}.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="relative py-unit-5 px-6 overflow-hidden bg-bg-alt">
      {/* Parallax orbs */}
      <motion.div
        style={{ y: orb1Y, scale: orb1Scale }}
        className="orb bg-accent opacity-[0.04] w-[600px] h-[600px] top-[10%] right-[-250px]"
      />
      <motion.div
        style={{ y: orb2Y, scale: orb2Scale }}
        className="orb bg-accent opacity-[0.03] w-[450px] h-[450px] bottom-[-150px] left-[-150px]"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatedSection animation="blurIn">
          <span className="font-mono text-accent text-sm tracking-[0.3em] mb-4 block uppercase">
            Contact
          </span>
        </AnimatedSection>

        <AnimatedSection animation="fadeUp" delay={0.1} className="mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-text mb-4">
            Let&apos;s create <span className="text-gradient">something amazing</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl">
            I am open to software engineering internship opportunities. Feel free to reach out — I would love to hear from you.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Contact Form */}
          <AnimatedSection animation="fadeLeft" delay={0.2}>
            <div className="card-premium p-8 md:p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl border border-border bg-bg flex items-center justify-center text-accent">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">Send a Message</h3>
                    <p className="text-text-muted text-sm">I&apos;ll get back to you ASAP.</p>
                  </div>
                </div>

                {/* noValidate: the browser's own bubble intercepts submit on empty
                    fields, which meant the inline errors, shake and toast below
                    never ran. Validation is handled in handleSubmit. */}
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Honeypot: bots fill this, humans never see it */}
                  <input
                    type="checkbox"
                    name="botcheck"
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                        onFocus={() => setErrors({ ...errors, name: "" })}
                        className={`w-full bg-bg border rounded-xl px-4 py-3.5 text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_15px_color-mix(in_srgb,var(--color-accent)_25%,transparent)] transition-all placeholder:text-text-dim ${errors.name ? "border-red-500/50 shake" : "border-border"} ${shakeField === "name" ? "animate-shake" : ""}`}
                        placeholder="Kavishka Deshan"
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1 font-medium">{errors.name}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        onFocus={() => setErrors({ ...errors, email: "" })}
                        className={`w-full bg-bg border rounded-xl px-4 py-3.5 text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_15px_color-mix(in_srgb,var(--color-accent)_25%,transparent)] transition-all placeholder:text-text-dim ${errors.email ? "border-red-500/50" : "border-border"} ${shakeField === "email" ? "animate-shake" : ""}`}
                        placeholder="hello@example.com"
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1 font-medium">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-muted uppercase tracking-wider">Message</label>
                    <div className="relative">
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => {
                          setFormData({ ...formData, message: e.target.value });
                          if (errors.message) setErrors({ ...errors, message: "" });
                        }}
                        onFocus={() => setErrors({ ...errors, message: "" })}
                        className={`w-full bg-bg border rounded-xl px-4 py-3.5 text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_15px_color-mix(in_srgb,var(--color-accent)_25%,transparent)] transition-all resize-none placeholder:text-text-dim ${errors.message ? "border-red-500/50" : "border-border"} ${shakeField === "message" ? "animate-shake" : ""}`}
                        placeholder="Let's discuss your project..."
                      />
                      {errors.message && <p className="text-red-400 text-xs mt-1 font-medium">{errors.message}</p>}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center btn-glow py-4 text-base group disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} className="group-hover:rotate-12 transition-transform" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </AnimatedSection>

          {/* Right Column: Direct Links & Info */}
          <AnimatedSection animation="fadeRight" delay={0.3} className="space-y-6">
            {/* Direct Contact Links */}
            <div className="card-premium p-8 rounded-3xl">
              <h3 className="text-lg font-bold text-text mb-6">Direct Contact</h3>
              <div className="space-y-4">
                <a
                  href={`mailto:${site.email}`}
                  className="group flex items-center justify-between p-4 rounded-2xl border border-border hover:border-accent/30 bg-bg hover:bg-accent/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl border border-border group-hover:border-accent/50 bg-bg-panel flex items-center justify-center transition-colors group-hover:bg-accent/10">
                      <Mail className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-0.5">Email Address</p>
                      <p className="text-text font-medium">{site.email}</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </a>

                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-4 rounded-2xl border border-border hover:border-accent/30 bg-bg hover:bg-accent/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl border border-border group-hover:border-accent/50 bg-bg-panel flex items-center justify-center transition-colors group-hover:bg-accent/10">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-text-muted group-hover:fill-accent transition-colors" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.886-9.885 9.886m8.413-18.297A11.8 11.8 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.548 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.8 11.8 0 0 0 20.464 3.488" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-0.5">WhatsApp</p>
                      <p className="text-text font-medium">Message me directly</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </a>
              </div>
            </div>

            {/* Socials + CV */}
            <div className="grid grid-cols-3 gap-4">
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group card-premium p-6 rounded-3xl flex flex-col items-center justify-center gap-3 border border-border hover:border-accent/30 transition-all"
              >
                <Github className="w-6 h-6 text-text-muted group-hover:text-accent transition-colors" />
                <span className="text-sm font-medium text-text group-hover:text-accent transition-colors">GitHub</span>
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group card-premium p-6 rounded-3xl flex flex-col items-center justify-center gap-3 border border-border hover:border-accent/30 transition-all"
              >
                <Linkedin className="w-6 h-6 text-text-muted group-hover:text-accent transition-colors" />
                <span className="text-sm font-medium text-text group-hover:text-accent transition-colors">LinkedIn</span>
              </a>
              <a
                href="/Kavishka_Deshan_CV.pdf"
                download
                className="group card-premium p-6 rounded-3xl flex flex-col items-center justify-center gap-3 border border-accent/20 hover:border-accent/50 hover:bg-accent/5 transition-all"
              >
                <FileText className="w-6 h-6 text-accent group-hover:text-accent transition-colors" />
                <span className="text-sm font-medium text-accent group-hover:text-accent transition-colors">Download CV</span>
              </a>
            </div>

            <button
              onClick={() => copyToClipboard(site.email, setCopiedEmail)}
              className="w-full p-4 rounded-2xl border border-border bg-bg hover:border-accent/30 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                {copiedEmail ? (
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Check size={18} />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full border border-border bg-bg-panel flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                    <Copy size={18} />
                  </div>
                )}
                <span className="text-sm font-medium text-text">{copiedEmail ? "Email Copied!" : "Copy Email Address"}</span>
              </div>
              <div className="text-xs font-mono text-text-muted opacity-50">
                {copiedEmail ? "✓" : "Click"}
              </div>
            </button>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
