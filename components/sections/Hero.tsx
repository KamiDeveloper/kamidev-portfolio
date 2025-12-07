"use client";

import { useRef, useEffect } from "react";
import { useGSAPContext } from "@/hooks/use-gsap-context";
import { useLanguage } from "@/lib/i18n-context";
import FluidBackground from "@/components/3d/FluidBackground";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleWrapperRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const { performAnimation, gsap } = useGSAPContext(containerRef);
  const { dict } = useLanguage();

  useEffect(() => {
    const cleanup = performAnimation(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out", delay: 1.5 }, // Premium heavy feel
      });

      // 1. Initial State Set (To prevent FOUC)
      gsap.set(".char-mask", { yPercent: 110, rotateX: 30, skewY: 10, opacity: 0 }); // Added skew and opacity for depth
      gsap.set(subtitleRef.current, { opacity: 0, y: 30 });
      gsap.set(".hero-bg", { opacity: 0 });

      // 2. Entrance Animation (Liquid Reveal)
      tl.to(".hero-bg", { opacity: 0.4, duration: 2.5, ease: "sine.inOut" })
        .to(".char-mask", {
          yPercent: 0,
          rotateX: 0,
          skewY: 0,
          opacity: 1,
          duration: 1.8,
          stagger: {
            amount: 0.5,
            from: "center", // Reveal from center looks more "architectural"
          },
          ease: "expo.out",
        }, "-=2.0")
        .to(subtitleRef.current, {
          delay: -0.25,
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
        }, "-=1.0");

      // 3. Scroll Interaction (Parallax & Fade)
      // Title moves up faster than scroll (parallax) and fades
      gsap.to(titleWrapperRef.current, {
        yPercent: -50,
        opacity: 0,
        scale: 0.9,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom 30%",
          scrub: 1,
        }
      });
    });

    return () => {
      cleanup?.();
    };
  }, [performAnimation, gsap, dict]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-bg-base"
    >
      <div className="hero-bg absolute inset-0 z-0">
        <FluidBackground />
      </div>

      <div className="relative z-10 text-center px-4 flex flex-col items-center mix-blend-difference" style={{ perspective: "1000px" }}>

        {/* Title Container */}
        <div ref={titleWrapperRef} className="flex flex-col items-center z-20">
          <h1 className="font-display font-bold text-[12vw] md:text-[10vw] text-text-primary uppercase flex flex-col items-center">
            <div className="flex overflow-hidden tracking-tight">
              <SplitWord word="JORGE" />
            </div>
            <div className="flex overflow-hidden -mt-[1vw] tracking-tight">
              <SplitWord word="MEDRANO" />
            </div>
          </h1>
        </div>

        <div ref={subtitleRef} className="mt-8 flex flex-col items-center z-20">
          <p className="text-xl md:text-2xl text-text-secondary font-light tracking-wide font-sans">
            {dict.hero.role}
          </p>
          <span className="block text-sm mt-3 text-accent-glow uppercase tracking-[0.2em] opacity-80 font-bold">
            {dict.hero.subtitle}
          </span>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <div className="animate-pulse-slow w-px h-24 bg-linear-to-b from-transparent via-text-secondary to-transparent" />
      </div>
    </section>
  );
}

// Helper components outside to prevent re-renders
const MaskedText = ({ text }: { text: string }) => (
  <span className="inline-block overflow-hidden py-4 -my-4 align-bottom leading-[0.85]">
    <span className="char-mask inline-block origin-bottom transform-gpu will-change-transform">
      {text}
    </span>
  </span>
);

const SplitWord = ({ word }: { word: string }) => (
  <span className="inline-flex mx-[0.2vw] whitespace-nowrap">
    {word.split("").map((char, i) => (
      <MaskedText key={`${word}-${i}`} text={char} />
    ))}
  </span>
);
