"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useGSAPContext } from "@/hooks/use-gsap-context";
import { useLanguage } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";

export default function Works() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { performAnimation, gsap, ScrollTrigger } = useGSAPContext(containerRef);
  const { dict } = useLanguage();

  const PROJECTS = [
    {
      id: "01",
      title: dict.works.projects.alvinGamesStore.title,
      category: dict.works.projects.alvinGamesStore.category,
      description: dict.works.projects.alvinGamesStore.desc,
      tech: ["Next.js 16", "TypeScript", "Firebase", "Vertex AI", "PWA"],
      image: "/images/projects/alvin-games-store-main.webp",
    },
    {
      id: "02",
      title: dict.works.projects.triadaAi.title,
      category: dict.works.projects.triadaAi.category,
      description: dict.works.projects.triadaAi.desc,
      tech: ["Next.js 16", "TypeScript", "Vertex AI", "Firebase", "Tailwind"],
      image: "/images/projects/triada-ai-main.webp",
    },
    {
      id: "03",
      title: dict.works.projects.hadoukenDojo.title,
      category: dict.works.projects.hadoukenDojo.category,
      description: dict.works.projects.hadoukenDojo.desc,
      tech: ["React 18", "JavaScript", "Supabase", "Tailwind"],
      image: "/images/projects/hadouken-dojo-main.webp",
    },
  ];

  useEffect(() => {
    const cleanup = performAnimation(() => {
      // Reveal Header
      gsap.from(".works-header", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });

      // Project Cards Parallax & Reveal
      const projects = gsap.utils.toArray(".project-card") as HTMLElement[];

      projects.forEach((card, i) => {
        // Entrance
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 100,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        });

        // Image Parallax Effect
        const img = card.querySelector(".project-img");
        if (img) {
          gsap.fromTo(img,
            { scale: 1.2, yPercent: -10 },
            {
              yPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              }
            }
          );
        }
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
    <section ref={containerRef} id="works" className="relative w-full py-32 bg-bg-base">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Header */}
        <div className="works-header mb-32 flex flex-col items-center text-center">
          <span className="text-accent-glow uppercase tracking-[0.3em] text-sm font-bold mb-6">
            {dict.works.category}
          </span>
          <h2 className="font-display text-6xl md:text-8xl font-bold text-text-primary uppercase leading-none whitespace-pre-line">
            {dict.works.title}
          </h2>
        </div>

        {/* Projects Grid/List */}
        <div className="flex flex-col gap-32">
          {PROJECTS.map((project, index) => (
            <div
              key={index}
              className={cn(
                "project-card flex flex-col md:flex-row gap-8 md:gap-16 items-center w-full",
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              )}
            >
              {/* Visual Side */}
              <div className="w-full md:w-3/5 group relative aspect-16/10 overflow-hidden rounded-sm">
                <div className="absolute inset-0 bg-gray-900 animate-pulse" /> {/* Placeholder while loading */}
                <div className="project-img absolute inset-0 w-full h-full">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 60vw, 840px"
                    quality={85}
                    priority={index === 0}
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                    onError={(e) => {
                      // Fallback in case of image load error
                      const target = e.target as HTMLImageElement;
                      target.style.opacity = "0.5";
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-2/5 flex flex-col justify-center">
                <span className="text-4xl font-display font-bold text-transparent text-stroke-1 opacity-20 mb-6">
                  {project.id}
                </span>
                <h3 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
                  {project.title}
                </h3>
                <span className="text-accent-glow text-sm uppercase tracking-widest font-bold mb-6 block">
                  {project.category}
                </span>
                <p className="text-text-secondary text-lg leading-relaxed mb-8 max-w-md">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-10">
                  {project.tech.map((t, i) => (
                    <span key={i} className="px-3 py-1 border border-white/10 rounded-full text-xs text-text-secondary uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>

                <button className="group relative w-fit px-8 py-3 overflow-hidden border border-white/20 rounded-full text-sm uppercase tracking-widest font-bold text-text-primary hover:text-black transition-colors duration-500">
                  <span className="relative z-10">View Case</span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
