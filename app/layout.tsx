import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google"; // Space Grotesk as a geometric/brutalist proxy for Clash Display
import "./globals.css";
import SmoothScrollWrapper from "@/components/SmoothScrollWrapper";
import Navbar from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";

// ============================================
// SEO Constants
// ============================================
const SITE_CONFIG = {
  name: "KamiDev",
  domain: "https://kamidev.app",
  email: "contact@kamidev.app",
  title: "KamiDev - Full Stack Developer Portfolio",
  description:
    "Full Stack Developer crafting modern web solutions with Next.js, React & TypeScript. Building scalable, performant applications. Let's connect!",
} as const;

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

// ============================================
// Next.js Metadata API
// ============================================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "Full Stack Developer",
    "Web Development",
    "Next.js Portfolio",
    "React Developer",
    "KamiDev",
    "JavaScript",
    "TypeScript",
    "Software Architect",
    "Frontend Developer",
    "Backend Developer",
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.domain }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: `${SITE_CONFIG.name} Portfolio`,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Full Stack Developer Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: ["/og-image.png"],
  },
};

// ============================================
// JSON-LD Structured Data
// ============================================
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_CONFIG.name,
  url: SITE_CONFIG.domain,
  email: SITE_CONFIG.email,
  jobTitle: "Full Stack Developer",
  sameAs: [
    // Add social profiles here if available
    // "https://github.com/kamidev",
    // "https://linkedin.com/in/kamidev",
  ],
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
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
