import "./globals.css";
import type { Metadata, Viewport } from "next";
import { allFontVariables } from "./fonts";
import { siteConfig } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Playground from "@/components/fun/Playground";
import Terminal from "@/components/fun/Terminal";
import SkinFeatures from "@/components/skins/SkinFeatures";
import { AudioProvider } from "@/components/skins/audio/AudioProvider";
import { getProjects } from "@/lib/projects";
import { SKIN_INIT_SCRIPT } from "@/lib/skin-init";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    // `creator` intentionally omitted — an unverified handle here would
    // credit the card to whoever actually owns it. Add it back once the
    // real handle is confirmed.
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    jobTitle: "Creative Technologist",
    affiliation: {
      "@type": "Organization",
      name: "MIT Media Lab",
      url: "https://www.media.mit.edu/",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cambridge",
      addressRegion: "MA",
      addressCountry: "US",
    },
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
  };

  const terminalProjects = getProjects().map((p) => ({
    slug: p.slug,
    title: p.title,
    year: p.startDate,
  }));

  return (
    // suppressHydrationWarning: the inline script below sets data-theme
    // before React hydrates, so the attribute legitimately differs.
    <html lang="en" className={allFontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SKIN_INIT_SCRIPT }} />
      </head>
      <body className="font-terminal antialiased">
        <a href="#main" className="skip-link font-pixel text-xs">
          Skip to content
        </a>
        <AudioProvider>
          <Nav />
          <main id="main" className="relative z-[1] pt-20 sm:pt-24">
            {children}
          </main>
          <Footer />
          <SkinFeatures />
          <Terminal projects={terminalProjects} />
          <Playground />
        </AudioProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
      </body>
    </html>
  );
}
