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
      <p
        className="mb-3 font-pixel text-xs"
        style={{ color: "var(--accent)" }}
      >
        WRITEUPS
      </p>
      <h1 className="font-pixel text-3xl md:text-5xl mb-6">
        Stories behind the builds
      </h1>
      <p
        className="mb-4 font-terminal text-lg"
        style={{ color: "var(--muted)" }}
      >
        Long-form writeups are coming soon — deep dives into the process,
        decisions, and lessons from each project.
      </p>
      <p
        className="mb-10 font-terminal text-sm"
        style={{ color: "var(--muted)" }}
      >
        In the meantime, browse the{" "}
        <Link href="/#projects" className="underline underline-offset-2">
          projects gallery
        </Link>{" "}
        for short summaries and links.
      </p>

      <div
        className="skin-surface p-6 font-terminal text-sm"
        style={{ color: "var(--muted)", borderStyle: "dashed" }}
      >
        <p
          className="mb-2 font-pixel text-xs"
          style={{ color: "var(--foreground)" }}
        >
          {"// TODO"}
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Earth Mission Control — building VR for climate science</li>
          <li>Generative AI visuals for Jordan Rudess at MIT</li>
          <li>Tipping Points — projection-mapped climate Jenga</li>
        </ul>
      </div>
    </section>
  );
}
