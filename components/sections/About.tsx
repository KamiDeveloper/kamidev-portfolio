"use client";

import { useRef, useEffect } from "react";
import { useGSAPContext } from "@/hooks/use-gsap-context";
import { useLanguage } from "@/lib/i18n-context";
import SystemArchitecture from "@/components/3d/SystemArchitecture";
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

      // Photo reveal animation - más dramática
      gsap.from(".about-photo-reveal", {
        scrollTrigger: {
          trigger: ".about-photo-reveal",
          start: "top 80%",
          once: true,
        },
        y: 100,
        opacity: 0,
        scale: 0.8,
        duration: 1.4,
        ease: "power4.out",
      });

      // Animate photo corners
      gsap.from(".corner-tl, .corner-br", {
        scrollTrigger: {
          trigger: ".photo-container",
          start: "top 80%",
          once: true,
        },
        width: 0,
        height: 0,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power2.out",
      });

      gsap.from(".corner-tr, .corner-bl", {
        scrollTrigger: {
          trigger: ".photo-container",
          start: "top 80%",
          once: true,
        },
        width: 0,
        height: 0,
        opacity: 0,
        duration: 1,
        delay: 0.7,
        ease: "power2.out",
      });

      // Bio reveal animation - cascada
      gsap.from(".about-bio-reveal", {
        scrollTrigger: {
          trigger: ".about-bio-reveal",
          start: "top 80%",
          once: true,
        },
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.3,
      });

      // Stats cards stagger
      gsap.from(".stat-card", {
        scrollTrigger: {
          trigger: ".stat-card",
          start: "top 85%",
          once: true,
        },
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "back.out(1.4)",
        delay: 0.5,
      });

      // Animated orbs
      gsap.to(".artist-orb-1", {
        x: 50,
        y: -50,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".artist-orb-2", {
        x: -30,
        y: 30,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
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
        {/* Section 1: System Architecture Visualization */}
        <div className="h-screen flex items-center justify-center p-10 border-b border-white/5 bg-surface-secondary/50 backdrop-blur-sm">
          <SystemArchitecture />
          <div className="flex-1 absolute h-auto w-[50%] top-[25%] about-bio-reveal">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
              {dict?.about?.fluid_title || "Fluid Motion"}
            </h2>
            <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-4">
              {dict?.about?.fluid_desc || "Loading..."}
            </p>
          </div>

        </div>

        {/* Section 2: The Artist - Biography with Photo */}
        <div className="relative h-screen flex items-end justify-center bg-gradient-to-t from-bg-base via-surface-tertiary to-surface-secondary overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Gradient Orbs */}
            <div className="artist-orb-1 absolute w-96 h-96 rounded-full bg-accent-glow/10 blur-3xl -top-20 -left-20" />
            <div className="artist-orb-2 absolute w-80 h-80 rounded-full bg-gray-500/10 blur-3xl bottom-40 right-20" />

            {/* Scanlines */}
            <div className="absolute inset-0 opacity-5">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-px bg-accent-glow mb-12"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>

          {/* Mobile Background Photo */}
          <div className="md:hidden absolute inset-0 z-0">
            <Image
              src="/images/kami-profpic.webp"
              alt="Jorge Medrano - KamiDev Background"
              fill
              className="object-cover object-center grayscale opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/80 to-transparent" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-0 flex flex-col md:flex-row items-end justify-end md:justify-start gap-8 md:gap-16 h-full">

            {/* Left Side: Photo (Desktop Only - 70% height from bottom) */}
            <div className="about-photo-reveal hidden md:flex relative md:w-5/12 h-[80%] items-end">
              <div className="relative w-full h-full group">
                {/* Glowing Frame Effect */}
                <div className="absolute -inset-1 bg-gradient-to-t from-accent-glow via-gray-600 to-transparent opacity-0 group-hover:opacity-30 blur-xl transition-all duration-700" />

                {/* Main Photo Container */}
                <div className="photo-container relative w-full h-full overflow-hidden bg-black">
                  {/* Grayscale Photo */}
                  <Image
                    src="/images/kami-profpic.webp"
                    alt="Jorge Medrano - KamiDev"
                    fill
                    className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000 ease-out transform group-hover:scale-105"
                    priority
                  />

                  {/* Overlay Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-accent-glow/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Corner Accents - Animated */}
                  <div className="corner-tl absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-accent-glow opacity-70 group-hover:w-24 group-hover:h-24 transition-all duration-500" />
                  <div className="corner-tr absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-accent-glow opacity-70 group-hover:w-24 group-hover:h-24 transition-all duration-500" />
                  <div className="corner-bl absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-accent-glow opacity-70 group-hover:w-24 group-hover:h-24 transition-all duration-500" />
                  <div className="corner-br absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-accent-glow opacity-70 group-hover:w-24 group-hover:h-24 transition-all duration-500" />

                  {/* Scan Line Effect */}


                  {/* Floating Name Tag */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-bg-base/90 backdrop-blur-md border-2 border-accent-glow/50 shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                    <p className="font-mono text-accent-glow uppercase tracking-[0.3em] text-sm font-bold ">
                      Jorge Medrano
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Biography */}
            <div className="about-bio-reveal w-full md:w-7/12 pb-12 sm:pb-16 md:pb-12 lg:pb-20 space-y-4 md:space-y-6">
              <div className="space-y-2 md:space-y-3">
                <span className="block text-accent-glow/70 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs font-bold font-mono">
                  02. {dict?.about?.artist_category || "The Artist"}
                </span>
                <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none">
                  {dict?.about?.artist_name || "KamiDev"}
                </h2>
              </div>

              <p className="text-text-secondary text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl">
                {dict?.about?.artist_bio || "Loading..."}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 pt-4 md:pt-6 max-w-2xl">
                <div className="stat-card group p-3 sm:p-4 md:p-5 bg-surface-secondary/50 backdrop-blur-sm border border-white/10 hover:border-accent-glow/50 transition-all duration-500 hover:shadow-lg hover:shadow-accent-glow/20">
                  <p className="text-[9px] sm:text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-wider mb-1 md:mb-2 group-hover:text-accent-glow transition-colors">
                    {dict?.about?.experience_label || "Experience"}
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl text-text-primary font-bold font-mono">
                    {dict?.about?.experience_value || "2+ Years"}
                  </p>
                </div>
                <div className="stat-card group p-3 sm:p-4 md:p-5 bg-surface-secondary/50 backdrop-blur-sm border border-white/10 hover:border-accent-glow/50 transition-all duration-500 hover:shadow-lg hover:shadow-accent-glow/20">
                  <p className="text-[9px] sm:text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-wider mb-1 md:mb-2 group-hover:text-accent-glow transition-colors">
                    {dict?.about?.projects_label || "Projects"}
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl text-text-primary font-bold font-mono">
                    {dict?.about?.projects_value || "10+"}
                  </p>
                </div>
                <div className="stat-card group p-3 sm:p-4 md:p-5 bg-surface-secondary/50 backdrop-blur-sm border border-white/10 hover:border-accent-glow/50 transition-all duration-500 hover:shadow-lg hover:shadow-accent-glow/20">
                  <p className="text-[9px] sm:text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-wider mb-1 md:mb-2 group-hover:text-accent-glow transition-colors">
                    {dict?.about?.status_label || "Status"}
                  </p>
                  <div className="flex items-center gap-1 md:gap-2">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-xs sm:text-sm text-emerald-400 font-semibold font-mono">
                      {dict?.about?.status_value || "Available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Styles */}
          <style jsx>{`
            @keyframes scan {
              0%, 100% {
                top: 0;
                opacity: 0;
              }
              50% {
                top: 50%;
                opacity: 1;
              }
            }
            
            .artist-orb-1 {
              animation: float 8s ease-in-out infinite;
            }
            
            .artist-orb-2 {
              animation: float 6s ease-in-out infinite reverse;
            }
            
            @keyframes float {
              0%, 100% {
                transform: translateY(0) rotate(0deg);
              }
              50% {
                transform: translateY(-30px) rotate(5deg);
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
