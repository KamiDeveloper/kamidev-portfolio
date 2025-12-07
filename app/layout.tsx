import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google"; // Space Grotesk as a geometric/brutalist proxy for Clash Display
import "./globals.css";
import SmoothScrollWrapper from "@/components/SmoothScrollWrapper";
import Navbar from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

// Primary Body Font
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

// Display Font (Title) - "Brutal" alternative to Clash Display
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-clash", // Mapped to the CSS variable we defined
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jorge Medrano | Software Architect",
  description: "Advanced Portfolio of Jorge Medrano - Full Stack Developer",
};

import { I18nProvider } from "@/lib/i18n-context";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-bg-base text-text-primary overflow-x-hidden selection:bg-accent-glow selection:text-white",
          manrope.variable,
          spaceGrotesk.variable
        )}
      >
        <I18nProvider>
          <SmoothScrollWrapper>
            <Navbar />
            <LanguageSwitcher />
            <main className="relative flex flex-col w-full min-h-screen">
              {children}
            </main>
          </SmoothScrollWrapper>
        </I18nProvider>
      </body>
    </html>
  );
}
