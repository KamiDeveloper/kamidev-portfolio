"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

// Register core plugins once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip);
}

export function useGSAPContext(scope: React.RefObject<HTMLElement | null>) {
  const ctx = useRef<gsap.Context | null>(null);

  const performAnimation = (animation: (context: gsap.Context) => void) => {
    if (!scope.current) return;

    // Clean up previous context before creating a new one
    ctx.current?.revert();

    ctx.current = gsap.context(animation, scope);

    return () => {
      ctx.current?.revert();
    };
  };

  useLayoutEffect(() => {
    return () => {
      ctx.current?.revert();
    };
  }, []);

  return { performAnimation, gsap, ScrollTrigger, Flip };
}
