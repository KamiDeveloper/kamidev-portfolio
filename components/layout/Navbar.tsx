"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n-context";

export default function Navbar() {
  const { dict } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navItems = [
    { name: dict.navbar.about, href: "#about", id: "about" },
    { name: dict.navbar.stack, href: "#stack", id: "stack" },
    { name: dict.navbar.works, href: "#works", id: "works" },
    { name: dict.navbar.contact, href: "#contact", id: "contact" },
  ];

  // Detect scroll past hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setIsScrolled(window.scrollY > heroHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cleanup scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Intersection Observer for active section detection
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Don't update active section while user is scrolling programmatically
      if (isScrolling) return;

      // Find the most visible section
      let mostVisibleId = "";
      let maxRatio = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          if (entry.target instanceof HTMLElement) {
            mostVisibleId = entry.target.id;
          }
        }
      });

      if (mostVisibleId && maxRatio > 0.2) {
        setActiveSection(mostVisibleId);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      rootMargin: "-15% 0px -15% 0px",
    });

    // Observe all sections with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      navItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element && observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [navItems, isScrolling]);

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Check if already at target
      const currentPosition = window.pageYOffset;
      const targetPosition = targetElement.offsetTop;

      // If already at target (within 50px threshold), don't animate
      if (Math.abs(currentPosition - targetPosition) < 50) {
        setActiveSection(targetId);
        setIsMobileMenuOpen(false);
        return;
      }

      // Set scrolling flag to prevent observer updates during animation
      setIsScrolling(true);

      const startPosition = currentPosition;
      const distance = targetPosition - startPosition;
      const duration = 1200; // ms
      let start: number | null = null;

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          // Animation complete
          setActiveSection(targetId);

          // Re-enable observer after a short delay
          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
          }, 100);
        }
      };

      requestAnimationFrame(animation);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Navbar (visible when not scrolled past hero) */}
      <nav
        className={cn(
          "fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500",
          isScrolled ? "opacity-0 pointer-events-none -translate-y-4" : "opacity-100"
        )}
      >
        <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl bg-bg-base/80 backdrop-blur-md border border-white/10">
          <Link
            href="/"
            className="text-xl font-display font-bold text-text-primary tracking-tighter hover:text-white transition-colors"
          >
            KD
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-medium text-text-secondary hover:text-white transition-colors relative group cursor-pointer"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-glow transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <button
            className="md:hidden text-text-primary hover:text-accent-glow transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-bg-base/95 backdrop-blur-lg transition-all duration-500",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={cn(
                "text-3xl font-display font-bold transition-all duration-500 cursor-pointer",
                isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                activeSection === item.id
                  ? "text-accent-glow scale-110"
                  : "text-text-secondary hover:text-white hover:scale-105"
              )}
              style={{ transitionDelay: isMobileMenuOpen ? `${index * 100}ms` : "0ms" }}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Close button */}
        <button
          className="absolute top-8 right-8 text-text-primary hover:text-accent-glow transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Sidebar Navigation (visible after scrolling past hero) */}
      <nav
        className={cn(
          "hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-50 flex-col gap-6 transition-all duration-500",
          isScrolled ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
        )}
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="group flex items-center justify-end gap-3 cursor-pointer"
            >
              {/* Label - always visible, changes size and color based on active state */}
              <span
                className={cn(
                  "font-medium transition-all duration-300 whitespace-nowrap text-right",
                  isActive
                    ? "text-white text-base font-bold tracking-wide scale-105"
                    : "text-text-secondary/60 text-sm group-hover:text-text-primary group-hover:scale-105"
                )}
              >
                {item.name}
              </span>

              {/* Indicator dot */}
              <div className="relative flex items-center justify-end">
                <span
                  className={cn(
                    "block rounded-full transition-all duration-300",
                    isActive
                      ? "bg-accent-glow w-3 h-3 shadow-[0_0_15px_currentColor]"
                      : "bg-text-secondary/40 w-2 h-2 group-hover:bg-text-primary group-hover:w-2.5 group-hover:h-2.5"
                  )}
                />
                {/* Active line */}
                {isActive && (
                  <span className="absolute right-0 w-8 h-px bg-accent-glow animate-pulse" />
                )}
              </div>
            </a>
          );
        })}

        {/* Decorative vertical line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </nav>

      {/* Mobile Sidebar (visible after scrolling past hero) */}
      <nav
        className={cn(
          "md:hidden fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 transition-all duration-500",
          isScrolled ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
        )}
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="flex items-center justify-end gap-2 cursor-pointer group"
            >
              {/* Label for active only on mobile */}
              {isActive && (
                <span className="text-xs font-medium text-accent-glow font-mono uppercase tracking-wider animate-fade-in">
                  {item.name}
                </span>
              )}

              {/* Indicator dot */}
              <span
                className={cn(
                  "block rounded-full transition-all duration-300",
                  isActive
                    ? "bg-accent-glow w-3 h-3 shadow-[0_0_15px_currentColor]"
                    : "bg-text-secondary/40 w-2 h-2 group-active:bg-text-primary group-active:w-2.5 group-active:h-2.5"
                )}
              />
            </a>
          );
        })}
      </nav>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
