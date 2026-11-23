import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Writeups",
  description:
    "In-depth writeups about projects, processes, and the stories behind the builds.",
  alternates: { canonical: "/writeups" },
};

export default function WriteupsPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
      <p className="font-pixel text-xs text-accent mb-3">WRITEUPS</p>
      <h1 className="font-pixel text-3xl md:text-5xl mb-6">
        Stories behind the builds
      </h1>
      <p className="font-terminal text-lg text-white/80 mb-4">
        Long-form writeups are coming soon — deep dives into the process,
        decisions, and lessons from each project.
      </p>
      <p className="font-terminal text-sm text-white/60 mb-10">
        In the meantime, browse the{" "}
        <Link
          href="/#projects"
          className="underline underline-offset-2 hover:text-accent"
        >
          projects gallery
        </Link>{" "}
        for short summaries and links.
      </p>

      <ul className="space-y-3 font-pixel text-xs">
        {[
          ["earth-mission-control", "Earth Mission Control"],
          ["jordan-rudess", "AI Visuals for Jordan Rudess"],
          ["tipping-points", "Tipping Points"],
        ].map(([slug, title]) => (
          <li key={slug}>
            <Link href={`/projects/${slug}`} className="hover:text-accent">
              {title} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
