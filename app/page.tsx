import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import Preloader from "@/components/Preloader";

// Lazy load sections after Hero to improve initial load performance
// Loading fallback prevents layout shift and maintains smooth UX
const About = dynamic(() => import("@/components/sections/About"), {
  loading: () => (
    <div className="h-screen bg-bg-base flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-glow border-t-transparent rounded-full animate-spin" />
    </div>
  ),
  ssr: true, // Keep SSR for SEO
});

const TechStack = dynamic(() => import("@/components/sections/TechStack"), {
  loading: () => <div className="h-screen bg-bg-base" />,
  ssr: true,
});

const Works = dynamic(() => import("@/components/sections/Works"), {
  loading: () => <div className="h-screen bg-bg-base" />,
  ssr: true,
});

const Skills = dynamic(() => import("@/components/sections/Skills"), {
  loading: () => <div className="h-screen bg-bg-base" />,
  ssr: true,
});

const Footer = dynamic(() => import("@/components/sections/Footer"), {
  loading: () => <div className="min-h-screen bg-bg-base" />,
  ssr: true,
});

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Preloader />
      <Hero />
      <About />
      <TechStack />
      <Works />
      <Skills />
      <Footer />
    </div>
  );
}
