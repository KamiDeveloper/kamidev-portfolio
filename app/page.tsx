import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import TechStack from "@/components/sections/TechStack";
import Works from "@/components/sections/Works";
import Skills from "@/components/sections/Skills";
import Footer from "@/components/sections/Footer";
import Preloader from "@/components/Preloader";

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
