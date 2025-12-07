"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n-context";

export default function Navbar() {
  const { dict } = useLanguage();

  const navItems = [
    { name: dict.navbar.about, href: "#about" },
    { name: dict.navbar.stack, href: "#stack" },
    { name: dict.navbar.works, href: "#works" },
    { name: dict.navbar.contact, href: "#contact" },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300">
      <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl bg-bg-base/80">
        <Link href="/" className="text-xl font-display font-bold text-text-primary tracking-tighter hover:text-white transition-colors">
          JM
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="text-sm font-medium text-text-secondary hover:text-white transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-glow transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <button className="md:hidden text-text-primary">
          <span className="sr-only">Menu</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
