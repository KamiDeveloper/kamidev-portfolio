"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAPContext } from "@/hooks/use-gsap-context";
import { useLanguage } from "@/lib/i18n-context";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [complete, setComplete] = useState(false);
  const { performAnimation, gsap } = useGSAPContext(containerRef);
  const { dict } = useLanguage();

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";

    const cleanup = performAnimation(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setComplete(true);
          document.body.style.overflow = "";
        }
      });

      // SVG Drawing Animation
      tl.fromTo(".path-draw",
        { strokeDasharray: 1000, strokeDashoffset: 1000 },
        { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" }
      );

      // Fill and Morph (Simulated)
      tl.to(".svg-container", {
        scale: 1.5,
        opacity: 0,
        duration: 1,
        ease: "power4.in",
        delay: 0.5
      });

      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "expo.inOut",
      }, "-=0.5");
    });

    return () => {
      cleanup?.();
      document.body.style.overflow = "";
    };
  }, [performAnimation, gsap, dict]);

  if (complete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-100 bg-bg-base flex items-center justify-center"
    >
      <div className="svg-container w-64 h-64 md:w-96 md:h-96 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M10,10 L90,10 L90,90 L10,90 Z"
            fill="none"
            stroke="#666666"
            strokeWidth="0.5"
            className="path-draw"
          />
          <path
            d="M30,30 L70,30 L70,70 L30,70 Z"
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="1"
            className="path-draw"
          />
          <line x1="10" y1="10" x2="30" y2="30" stroke="#666666" strokeWidth="0.5" className="path-draw" />
          <line x1="90" y1="10" x2="70" y2="30" stroke="#666666" strokeWidth="0.5" className="path-draw" />
          <line x1="90" y1="90" x2="70" y2="70" stroke="#666666" strokeWidth="0.5" className="path-draw" />
          <line x1="10" y1="90" x2="30" y2="70" stroke="#666666" strokeWidth="0.5" className="path-draw" />
        </svg>
        <div className="absolute bottom-[-40px] left-0 w-full text-center">
          <span className="font-display text-xs tracking-[0.3em] uppercase text-text-secondary animate-pulse">
            {dict.preloader.text}
          </span>
        </div>
      </div>
    </div>
  );
}
