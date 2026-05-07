import "./globals.css";
import type { Metadata, Viewport } from "next";
import { pixelFont, terminalFont } from "./fonts";
import { siteConfig } from "@/lib/site";
import Nav from "@/components/Nav";

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
    creator: "@pcherner",
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

  return (
    <html
      lang="en"
      className={`${pixelFont.variable} ${terminalFont.variable}`}
    >
      <body className="bg-black text-white font-terminal antialiased">
        <a href="#main" className="skip-link font-pixel text-xs">
          Skip to content
        </a>
        <Nav />
        <main id="main" className="pt-20 sm:pt-24">
          {children}
        </main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
      </body>
    </html>
  );
}
