"use client";

import { useRef, useEffect } from "react";
import { useGSAPContext } from "@/hooks/use-gsap-context";
import { useLanguage } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";
import { TECH_LOGOS, type TechLogoKey } from "./StackLogos";

export default function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { performAnimation, gsap, ScrollTrigger } = useGSAPContext(containerRef);
  const { dict } = useLanguage();

  const TECH_ITEMS = [
    { name: "Next.js", category: dict.stack.items.next, color: "#ffffff", logo: "nextjs" as TechLogoKey },
    { name: "React", category: dict.stack.items.react, color: "#61dafb", logo: "react" as TechLogoKey },
    { name: "TypeScript", category: dict.stack.items.ts, color: "#3178c6", logo: "typescript" as TechLogoKey },
    { name: "Tailwind", category: dict.stack.items.tailwind, color: "#38bdf8", logo: "tailwind" as TechLogoKey },
    { name: "GSAP", category: dict.stack.items.gsap, color: "#0ae448", logo: "gsap" as TechLogoKey },
    { name: "Firebase", category: dict.stack.items.firebase, color: "#ffca28", logo: "firebase" as TechLogoKey },
    { name: "Supabase", category: dict.stack.items.supabase, color: "#3ecf8e", logo: "supabase" as TechLogoKey },
    { name: "Vertex AI", category: dict.stack.items.vertex, color: "#4285f4", logo: "vertexai" as TechLogoKey },
    { name: "Python", category: dict.stack.items.python, color: "#ffe873", logo: "python" as TechLogoKey },
    { name: "Kotlin", category: dict.stack.items.kotlin, color: "#7f52ff", logo: "kotlin" as TechLogoKey },
  ];

  useEffect(() => {
    const cleanup = performAnimation(() => {
      // 1. Initial State
      gsap.set(".tech-card", { y: 80, opacity: 0, scale: 0.9, rotateX: -15 });
      gsap.set(".tech-header", { y: 50, opacity: 0 });
      gsap.set(".tech-number", { opacity: 0, x: -20 });
      gsap.set(".tech-logo-bg", { scale: 0, rotation: -180, opacity: 0 });

      // 2. Header Reveal
      gsap.to(".tech-header", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      // 3. Grid Entrance - Cards with 3D effect
      gsap.to(".tech-card", {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 1,
        stagger: {
          amount: 0.8,
          from: "start",
          ease: "power2.out"
        },
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      // 4. Numbers fade in
      gsap.to(".tech-number", {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
      });

      // 5. Logos spin in
      gsap.to(".tech-logo-bg", {
        scale: 1,
        rotation: 0,
        opacity: 0.15,
        duration: 1.2,
        stagger: 0.08,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
      });

      // 6. Continuous subtle floating animation for cards
      gsap.utils.toArray<HTMLElement>(".tech-card").forEach((card, i) => {
        gsap.to(card, {
          y: "+=10",
          duration: 2 + (i * 0.1),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.1,
        });
      });
    });

    // Force ScrollTrigger refresh after content changes
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanup?.();
    };
  }, [performAnimation, gsap, ScrollTrigger, dict]);

  return (
    <section
      ref={containerRef}
      id="stack"
      className="relative w-full py-32 px-6 bg-bg-base overflow-hidden"
      style={{ perspective: "2000px" }}
    >
      {/* Enhanced Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-glow/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="tech-header mb-20 md:mb-32 flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/10 pb-8">
          <div className="relative">
            <span className="block text-accent-glow uppercase tracking-[0.3em] text-sm font-bold mb-4">
              {dict.stack.category}
            </span>
            <h2 className="font-display text-6xl md:text-8xl font-bold text-text-primary uppercase leading-none whitespace-pre-line">
              {dict.stack.title}
            </h2>
            {/* Large background text */}
            <div className="absolute -top-8 -left-4 text-[180px] md:text-[220px] font-display font-bold text-white/[0.02] leading-none pointer-events-none select-none">
              STACK
            </div>
          </div>
          <p className="mt-8 md:mt-0 max-w-md text-text-secondary text-lg font-light leading-relaxed">
            {dict.stack.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {TECH_ITEMS.map((item, index) => (
            <div
              key={index}
              className="tech-card group relative p-8 rounded-3xl bg-gradient-to-br from-surface-secondary/40 to-surface-secondary/20 border border-white/10 hover:border-white/30 transition-all duration-700 overflow-hidden backdrop-blur-sm"
            >
              {/* Animated gradient overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${item.color}15, transparent 70%)`
                }}
              />

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                    transform: 'translateX(-100%)',
                    animation: 'shine 2s infinite'
                  }}
                />
              </div>

              {/* Logo background - HUGE and subtle */}
              {TECH_LOGOS[item.logo] && (
                <div
                  className="tech-logo-bg absolute inset-0 w-full h-full opacity-0 transition-all duration-700 group-hover:opacity-[0.08] group-hover:scale-110 flex items-center justify-center"
                  style={{
                    filter: 'blur(1px)',
                    color: item.color,
                  }}
                >
                  {TECH_LOGOS[item.logo]()}
                </div>
              )}

              <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
                <div className="flex justify-between items-start mb-12">
                  <span className="tech-number text-xs font-mono text-text-secondary/60 uppercase tracking-[0.2em] font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div
                    className="w-3 h-3 rounded-full shadow-[0_0_15px_currentColor] group-hover:shadow-[0_0_25px_currentColor] transition-all duration-500"
                    style={{
                      color: item.color,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                <div>
                  <h3
                    className="font-display text-3xl font-bold text-text-primary mb-3 group-hover:translate-x-2 transition-all duration-500 leading-none"
                    style={{
                      textShadow: `0 0 30px ${item.color}00, 0 0 60px ${item.color}00`,
                    }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-xs text-text-secondary/80 uppercase tracking-[0.15em] font-semibold group-hover:text-text-secondary transition-colors duration-500">
                    {item.category}
                  </p>
                </div>
              </div>

              {/* Corner accents */}
              <div
                className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle at top right, ${item.color}, transparent)`
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-20 h-20 opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle at bottom left, ${item.color}, transparent)`
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}
