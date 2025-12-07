"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScrollWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Detect if device has touch capability
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: !isTouchDevice, // Disable smooth wheel on touch devices
      touchMultiplier: 2,
      infinite: false,
      syncTouch: true, // Enable touch synchronization
    });

    let rafId: number;

    // Synchronize Lenis with GSAP ScrollTrigger
    const scrollHandler = ScrollTrigger.update;
    lenis.on("scroll", scrollHandler);

    const tickerHandler = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerHandler);
    gsap.ticker.lagSmoothing(0);

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      // Proper cleanup
      cancelAnimationFrame(rafId);
      lenis.off("scroll", scrollHandler);
      gsap.ticker.remove(tickerHandler);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
