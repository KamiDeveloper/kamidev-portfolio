"use client";

import { useLanguage } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";
import { useGSAPContext } from "@/hooks/use-gsap-context";
import { useRef, useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { performAnimation, gsap } = useGSAPContext(containerRef);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Only animate on initial mount, not on language changes
    if (hasAnimated || !containerRef.current) return;

    const cleanup = performAnimation(() => {
      gsap.fromTo(containerRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 2,
          ease: "power3.out",
          onComplete: () => setHasAnimated(true)
        }
      );
    });

    return () => {
      cleanup?.();
    };
  }, [performAnimation, gsap, hasAnimated]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 p-2 rounded-full glass-panel"
    >
      <LanguageButton
        current={language}
        target="es"
        label="ES"
        onClick={() => setLanguage('es')}
      />
      <div className="w-px h-3 bg-white/10" />
      <LanguageButton
        current={language}
        target="en"
        label="EN"
        onClick={() => setLanguage('en')}
      />
      <div className="w-px h-3 bg-white/10" />
      <LanguageButton
        current={language}
        target="jp"
        label="JP"
        onClick={() => setLanguage('jp')}
      />
    </div>
  );
}

function LanguageButton({
  current,
  target,
  label,
  onClick
}: {
  current: string,
  target: string,
  label: string,
  onClick: () => void
}) {
  const isActive = current === target;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold tracking-wider transition-all duration-300 relative overflow-hidden",
        isActive ? "text-bg-base" : "text-text-secondary hover:text-white"
      )}
    >
      {isActive && (
        <span className="absolute inset-0 bg-white rounded-full z-0 block" />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}
