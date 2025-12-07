"use client";

import { useGSAPContext } from "@/hooks/use-gsap-context";
import { useRef } from "react";
import { useLanguage } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { performAnimation, gsap } = useGSAPContext(footerRef);
  const { dict } = useLanguage();

  const handleMouseEnter = (e: React.MouseEvent) => {
    // Magnetic Button Effect
    const btn = btnRef.current;
    if (!btn) return;

    // Simple scale up for now, full magnetic reqs tracking mouse relative to btn center
    gsap.to(btn, { scale: 1.05, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { scale: 1, x: 0, y: 0, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <footer ref={footerRef} id="contact" className="relative w-full py-20 bg-bg-base border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
        <h2 className="font-display text-5xl md:text-7xl font-bold text-text-primary mb-12">
          {dict.footer.title_1} <span className="text-accent-glow">{dict.footer.title_2}</span>.
        </h2>

        <form className="w-full max-w-lg space-y-8 mb-20">
          <div className="relative group">
            <input
              type="text"
              placeholder={dict.footer.name_ph}
              className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-glow transition-colors"
            />
            <div className="absolute bottom-0 left-0 w-0 h-px bg-accent-glow transition-all duration-500 group-focus-within:w-full" />
          </div>

          <div className="relative group">
            <input
              type="email"
              placeholder={dict.footer.email_ph}
              className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-glow transition-colors"
            />
            <div className="absolute bottom-0 left-0 w-0 h-px bg-accent-glow transition-all duration-500 group-focus-within:w-full" />
          </div>

          <div className="relative group">
            <textarea
              placeholder={dict.footer.vision_ph}
              rows={1}
              className="w-full bg-transparent border-b border-white/20 py-4 text-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-glow transition-colors resize-none"
            />
            <div className="absolute bottom-0 left-0 w-0 h-px bg-accent-glow transition-all duration-500 group-focus-within:w-full" />
          </div>

          <div className="pt-8">
            <button
              ref={btnRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              className="px-12 py-4 rounded-full bg-surface-primary text-text-primary border border-white/20 hover:bg-white/5 transition-colors font-bold tracking-widest uppercase overflow-hidden relative"
            >
              <span className="relative z-10">{dict.footer.submit}</span>
              <div className="absolute inset-0 bg-accent-glow/20 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>
        </form>

        <div className="flex gap-8 text-sm text-text-secondary uppercase tracking-widest">
          <a href="https://github.com/KamiDeveloper" className="hover:text-white transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/jorge-medrano-ramirez/" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="https://x.com/KamiDev_" className="hover:text-white transition-colors">Twitter</a>
        </div>

        <p className="mt-12 text-xs text-text-secondary/50">
          © {new Date().getFullYear()} JORGE MEDRANO. {dict.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
