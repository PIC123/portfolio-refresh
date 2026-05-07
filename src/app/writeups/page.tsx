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

      <div className="rounded border border-dashed border-white/30 p-6 font-terminal text-sm text-white/55">
        <p className="mb-2 font-pixel text-xs text-white/70">{"// TODO"}</p>
        <ul className="ml-5 list-disc space-y-1 marker:text-accent/60">
          <li>Earth Mission Control — building VR for climate science</li>
          <li>Generative AI visuals for Jordan Rudess at MIT</li>
          <li>Tipping Points — projection-mapped climate Jenga</li>
        </ul>
      </div>
    </section>
  );
}
