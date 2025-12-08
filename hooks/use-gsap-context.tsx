"use client";

import { useLayoutEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { prefersReducedMotion } from "@/lib/utils";

// Register core plugins once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip);
}

export function useGSAPContext(scope: React.RefObject<HTMLElement | null>) {
  const ctx = useRef<gsap.Context | null>(null);
  const shouldReduceMotion = useRef<boolean>(false);

  // Check for reduced motion preference on mount
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      shouldReduceMotion.current = prefersReducedMotion();

      // Listen for changes in motion preference
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleChange = (e: MediaQueryListEvent) => {
        shouldReduceMotion.current = e.matches;
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const performAnimation = useCallback((animation: (context: gsap.Context) => void) => {
    if (!scope.current) return;

    // If user prefers reduced motion, skip animations
    if (shouldReduceMotion.current) {
      console.log("⚠️ Reduced motion preference detected, skipping animations");
      return () => { }; // No-op cleanup
    }

    // Clean up previous context before creating a new one
    ctx.current?.revert();

    ctx.current = gsap.context(animation, scope);

    return () => {
      ctx.current?.revert();
    };
  }, [scope]);

  useLayoutEffect(() => {
    return () => {
      ctx.current?.revert();
    };
  }, []);

  return { performAnimation, gsap, ScrollTrigger, Flip };
}
