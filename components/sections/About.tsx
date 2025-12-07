"use client";

import { useRef, useEffect } from "react";
import { useGSAPContext } from "@/hooks/use-gsap-context";
import { useLanguage } from "@/lib/i18n-context";
import Image from "next/image";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const { performAnimation, ScrollTrigger, gsap } = useGSAPContext(containerRef);
  const { dict } = useLanguage();

  useEffect(() => {
    if (!containerRef.current) return;

    const cleanup = performAnimation(() => {
      // Pinning logic for split screen
      if (window.innerWidth > 768 && leftColRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: leftColRef.current,
          pinSpacing: false, // Right side scrolls naturally
        });
      }

      // Animation elements entering
      gsap.from(".about-text-reveal", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
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
  }, [performAnimation, ScrollTrigger, gsap, dict]);

  return (
    <section ref={containerRef} id="about" className="relative w-full min-h-[200vh] flex flex-col md:flex-row bg-surface-secondary">
      {/* Left Column - Solid Architecture (Pinned on Desktop) */}
      <div
        ref={leftColRef}
        className="w-full md:w-1/2 h-screen flex flex-col justify-center p-8 md:p-20 bg-bg-base md:sticky md:top-0 z-10 border-r border-white/5"
      >
        <div className="max-w-xl">
          <span className="about-text-reveal block text-accent-glow uppercase tracking-[0.2em] mb-4 text-sm font-bold">
            01. {dict?.about?.title || "Architecture"}
          </span>
          <h2 className="about-text-reveal font-display text-5xl md:text-7xl font-bold text-text-primary mb-8 leading-tight">
            {dict?.about?.solid_title || "Solid System"}
          </h2>
          <p className="about-text-reveal text-text-secondary text-lg leading-relaxed mb-6">
            {dict?.about?.solid_desc || "Loading..."}
          </p>
          <div className="about-text-reveal grid grid-cols-2 gap-4 mt-8">
            <div className="p-4 border border-white/10 rounded-sm">
              <h3 className="text-white font-bold mb-1">{dict?.about?.systems || "Systems"}</h3>
              <p className="text-sm text-gray-500">{dict?.about?.eng_approach || "Engineering"}</p>
            </div>
            <div className="p-4 border border-white/10 rounded-sm">
              <h3 className="text-white font-bold mb-1">{dict?.about?.scalability || "Scalability"}</h3>
              <p className="text-sm text-gray-500">{dict?.about?.future_proof || "Future Proof"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Fluid Frontend (Scrollable) */}
      <div ref={rightColRef} className="w-full md:w-1/2 flex flex-col z-20">
        <div className="h-screen flex items-center justify-center p-10 border-b border-white/5 bg-surface-secondary/50 backdrop-blur-sm">
          <div className="relative w-full aspect-square max-w-md bg-linear-to-br from-gray-800 to-black rounded-full overflow-hidden flex items-center justify-center border border-white/10">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <span className="text-3xl font-display text-white mix-blend-overlay">UI / UX</span>
          </div>
        </div>
        <div className="h-screen flex items-center justify-center p-10 bg-surface-tertiary">
          <div className="max-w-md">
            <span className="block text-accent-glow uppercase tracking-[0.2em] mb-4 text-sm font-bold">
              02. The Artist
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-text-primary mb-6">
              {dict?.about?.fluid_title || "Fluid Motion"}
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              {dict?.about?.fluid_desc || "Loading..."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
