import "./globals.css";
import type { Metadata, Viewport } from "next";
import {
  pixelFont,
  terminalFont,
  lcdFont,
  retroFont,
  scriptFont,
} from "./fonts";
import { siteConfig } from "@/lib/site";
import { SKIN_INIT_SCRIPT } from "@/lib/skin-init";
import Nav from "@/components/Nav";
import SkinFeatures from "@/components/skins/SkinFeatures";
import { AudioProvider } from "@/components/skins/audio/AudioProvider";

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
  alternates: { canonical: "/" },
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
    creator: "@pcherner",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: { icon: "/favicon.ico" },
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

  const fontVars = [
    pixelFont.variable,
    terminalFont.variable,
    lcdFont.variable,
    retroFont.variable,
    scriptFont.variable,
  ].join(" ");

  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SKIN_INIT_SCRIPT }} />
      </head>
      <body className="font-terminal antialiased">
        <a href="#main" className="skip-link font-pixel text-xs">
          Skip to content
        </a>
        <AudioProvider>
          <Nav />
          <main id="main" className="relative pt-20 sm:pt-24 z-[1]">
            {children}
          </main>
          <SkinFeatures />
        </AudioProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
      </body>
    </html>
  );
}
