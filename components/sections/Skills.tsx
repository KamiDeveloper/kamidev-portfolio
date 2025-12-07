"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAPContext } from "@/hooks/use-gsap-context";
import { useLanguage } from "@/lib/i18n-context";

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { performAnimation, gsap, ScrollTrigger } = useGSAPContext(containerRef);
  const { dict } = useLanguage();

  const TERMINAL_DATA = [
    {
      label: dict.skills.identity,
      value: "Jorge Medrano",
      color: "text-text-primary"
    },
    {
      label: dict.skills.role,
      value: dict.skills.role_val,
      color: "text-accent-glow"
    },
    {
      label: dict.skills.location,
      value: dict.skills.loc_val,
      color: "text-text-secondary"
    },
    {
      label: dict.skills.languages,
      value: dict.skills.lang_val,
      color: "text-emerald-400"
    },
    {
      label: dict.skills.creative,
      value: "Photoshop, Illustrator, DaVinci Resolve, FL Studio",
      color: "text-pink-400"
    }
  ];

  // Setup animations only when section enters viewport
  useEffect(() => {
    if (!containerRef.current || !terminalRef.current) return;

    const cleanup = performAnimation(() => {
      const container = containerRef.current;
      const terminal = terminalRef.current;
      if (!container || !terminal) return;

      const bioLines = gsap.utils.toArray<HTMLElement>(".bio-line");
      const dataRows = gsap.utils.toArray<HTMLElement>(".data-row");
      const terminalWindow = container.querySelector(".terminal-window");
      const terminalHeader = container.querySelector(".terminal-header");

      if (!bioLines.length || !dataRows.length || !terminalWindow) return;

      // Initial state
      gsap.set(terminalWindow, { y: 60, opacity: 0, scale: 0.95 });
      gsap.set(bioLines, { opacity: 0, x: -20 });
      gsap.set(dataRows, { opacity: 0, y: 20 });

      // Terminal window entrance
      gsap.to(terminalWindow, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: terminal,
          start: "top 75%",
          end: "top 25%",
          once: true,
          onEnter: () => !hasAnimated && setHasAnimated(true),
        },
      });

      // Bio lines typing effect
      gsap.to(bioLines, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: terminal,
          start: "top 70%",
          once: true,
        },
      });

      // Data rows fade in
      gsap.to(dataRows, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: terminal,
          start: "top 65%",
          once: true,
        },
      });

      // Subtle terminal glow animation
      if (terminalWindow) {
        gsap.to(terminalWindow, {
          boxShadow: "0 0 40px rgba(102, 102, 102, 0.2)",
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: terminal,
            start: "top 70%",
            once: true,
          },
        });
      }
    });

    // Refresh ScrollTrigger after setup
    const timer = setTimeout(() => {
      if (ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      cleanup?.();
    };
  }, [performAnimation, gsap, ScrollTrigger, dict, hasAnimated]);

  return (
    <section ref={containerRef} className="relative w-full py-32 px-6 bg-bg-base flex justify-center items-center">
      <div ref={terminalRef} className="max-w-4xl w-full">

        {/* Header */}
        <div className="terminal-header mb-16 text-center">
          <span className="text-accent-glow uppercase tracking-[0.3em] text-xs font-bold">
            {dict.skills.category}
          </span>
        </div>

        {/* Terminal Window */}
        <div className="terminal-window w-full bg-surface-secondary/50 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden shadow-2xl">
          {/* Terminal Header */}
          <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
            <div className="ml-4 text-[10px] font-mono text-white/30 tracking-widest">USER_PROFILE_V2.0</div>
          </div>

          {/* Terminal Body */}
          <div className="p-8 md:p-12 font-mono text-sm md:text-base leading-relaxed">

            <div className="terminal-content mb-12 space-y-2 text-text-secondary/80">
              {dict.skills.lines.map((line, i) => (
                <p key={i} className="bio-line">
                  <span className="text-accent-glow mr-2">
                    {i < 2 ? ">>" : "#"}
                  </span>
                  {line}
                </p>
              ))}
              <p className="bio-line animate-pulse">_</p>
            </div>

            {/* Structured Data Grid */}
            <div className="data-grid grid grid-cols-1 gap-6 border-t border-white/10 pt-8">
              {TERMINAL_DATA.map((item, index) => (
                <div key={index} className="data-row flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                  <span className="text-white/40 md:w-32 uppercase tracking-widest text-xs shrink-0">
                    {item.label}
                  </span>
                  <span className={`${item.color} font-medium tracking-wide`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
