import type { Metadata } from "next";
import Link from "next/link";
import OAuthHandshake from "@/components/OAuthHandshake";
import { siteConfig } from "@/lib/site";

// Hardcoded on purpose: a "last updated" date that silently changes on every
// deploy would be misleading. Bump this by hand when the text changes.
const LAST_UPDATED = "September 18, 2026";

export const metadata: Metadata = {
  title: "OAuth Disclosure",
  description:
    "Disclosure page for a personal automation client used solely by Phil Cherner to access their own Google Calendar and Tasks.",
  alternates: { canonical: "/oauth" },
  // Reachable by direct URL, never surfaced in search.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function OAuthDisclosurePage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <OAuthHandshake />
      <p className="mt-3 font-terminal text-xs text-white/50">
        personal automation client ⟷ google api · token exchange
      </p>

      <header className="mt-10">
        <p className="font-pixel text-xs text-accent mb-3">OAUTH DISCLOSURE</p>
        <h1 className="font-pixel text-3xl md:text-4xl leading-snug mb-4">
          OAuth Disclosure
        </h1>
        <p className="font-terminal text-sm text-white/60">
          Last updated: {LAST_UPDATED}
        </p>
      </header>

      <div className="mt-10 space-y-6 font-terminal text-lg leading-relaxed text-white">
        <p>
          This is the disclosure page for a personal automation client used
          solely by Phil Cherner to access their own Google Calendar and
          Google Tasks.
        </p>
        <p>
          It has no other users. It collects no data from anyone. It shares no
          data with third parties.
        </p>
        <p>
          Contact:{" "}
          <a
            href="mailto:pcherner4@gmail.com"
            className="underline underline-offset-4 hover:text-accent"
          >
            pcherner4@gmail.com
          </a>
        </p>
      </div>

      <hr className="my-12 border-white/15" />

      <section className="space-y-4">
        <h2 className="font-pixel text-lg md:text-xl">
          Data handling (privacy policy)
        </h2>
        <p className="font-terminal text-base leading-relaxed text-white/85">
          The client authenticates as a single Google account and reads and
          writes only that same account&apos;s Calendar and Tasks data. It does
          not collect information from visitors to this page, it does not
          operate on behalf of any other person, and it does not sell,
          transfer, or otherwise share data with third parties. Authorization
          can be revoked at any time from the Google Account permissions page.
        </p>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-pixel text-lg md:text-xl">Terms of use</h2>
        <p className="font-terminal text-base leading-relaxed text-white/85">
          The client is a personal tool provided as-is, for use by its sole
          operator. It is not offered as a service to anyone else, has no other
          users, and carries no warranty. The operator may change or shut it
          down at any time.
        </p>
      </section>

      <footer className="mt-14 flex flex-wrap items-center gap-4 border-t border-white/15 pt-6">
        <Link
          href="/"
          className="font-pixel text-xs text-white/60 hover:text-accent"
        >
          ← {siteConfig.name}
        </Link>
        <span className="font-terminal text-xs text-white/40">
          {siteConfig.url.replace(/^https?:\/\//, "")}/oauth
        </span>
      </footer>
    </article>
  );
}
