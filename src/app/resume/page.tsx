import type { Metadata } from "next";
import Link from "next/link";
import portfolio from "@/data/portfolio.json";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume and experience for ${siteConfig.name} — engineer, researcher, and creative technologist at the MIT Media Lab.`,
  alternates: { canonical: "/resume" },
};

type Experience = {
  id: string;
  dates: string;
  type: string;
  position: string;
  bullets: string[];
};

type Education = {
  id: string;
  universityName: string;
  universityDate: string;
  universityDegree: string;
  universityPara: string;
};

type Publication = {
  id: string;
  title: string;
  URL?: string;
  publisher?: string;
  type?: string;
  issued?: { "date-parts": (string | number)[][] };
};

export default function ResumePage() {
  const { resume } = portfolio;
  const experiences = resume.experiences as Experience[];
  const education = resume.education as Education[];
  const publications = resume.publications as Publication[];

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <header className="mb-12">
        <p
          className="mb-3 font-pixel text-xs"
          style={{ color: "var(--accent)" }}
        >
          RESUME
        </p>
        <h1 className="font-pixel text-3xl md:text-5xl mb-4">
          {siteConfig.name}
        </h1>
        <p
          className="mb-2 font-terminal text-lg"
          style={{ color: "var(--muted)" }}
        >
          {resume.tagline}
        </p>
        <p
          className="font-terminal text-sm"
          style={{ color: "var(--subtle)" }}
        >
          {siteConfig.location} ·{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="underline underline-offset-2"
            style={{ color: "var(--muted)" }}
          >
            {siteConfig.email}
          </a>{" "}
          ·{" "}
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
            style={{ color: "var(--muted)" }}
          >
            GitHub
          </a>{" "}
          ·{" "}
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
            style={{ color: "var(--muted)" }}
          >
            LinkedIn
          </a>
        </p>
        <p
          className="mt-6 font-terminal leading-relaxed"
          style={{ color: "var(--foreground)" }}
        >
          {resume.description}
        </p>
      </header>

      <Section title="Experience">
        <ol className="space-y-8">
          {experiences.map((exp) => (
            <li key={exp.id}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-pixel text-sm md:text-base">
                  {exp.position}
                </h3>
                <span
                  className="font-terminal text-xs"
                  style={{ color: "var(--subtle)" }}
                >
                  {exp.dates}
                </span>
              </div>
              <p
                className="mb-3 font-terminal text-xs"
                style={{ color: "var(--subtle)" }}
              >
                {exp.type}
              </p>
              <ul
                className="ml-5 list-disc space-y-1.5 font-terminal text-sm"
                style={{ color: "var(--muted)" }}
              >
                {exp.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Education">
        <ol className="space-y-6">
          {education.map((ed) => (
            <li key={ed.id}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-pixel text-sm md:text-base">
                  {ed.universityName}
                </h3>
                <span
                  className="font-terminal text-xs"
                  style={{ color: "var(--subtle)" }}
                >
                  {ed.universityDate}
                </span>
              </div>
              <p className="font-terminal text-sm">{ed.universityDegree}</p>
              <p
                className="font-terminal text-sm"
                style={{ color: "var(--muted)" }}
              >
                {ed.universityPara}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Skills">
        <SkillBlock label="Languages" items={resume.languages} />
        <SkillBlock label="Frameworks" items={resume.frameworks} />
        <SkillBlock label="Tools" items={resume.others} />
      </Section>

      {publications.length > 0 && (
        <Section title="Publications">
          <ol className="space-y-4">
            {publications.map((pub) => {
              const year = pub.issued?.["date-parts"]?.[0]?.[0];
              return (
                <li key={pub.id}>
                  <p className="mb-1 font-pixel text-sm md:text-base">
                    {pub.URL ? (
                      <a
                        href={pub.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                      >
                        {pub.title} ↗
                      </a>
                    ) : (
                      pub.title
                    )}
                  </p>
                  <p
                    className="font-terminal text-xs"
                    style={{ color: "var(--subtle)" }}
                  >
                    {[pub.publisher, year, pub.type].filter(Boolean).join(" · ")}
                  </p>
                </li>
              );
            })}
          </ol>
        </Section>
      )}

      <div className="mt-16">
        <Link
          href="/"
          className="font-pixel text-xs"
          style={{ color: "var(--muted)" }}
        >
          ← Back to portfolio
        </Link>
      </div>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="mb-12 pt-8"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <h2 className="mb-6 font-pixel text-xl md:text-2xl">{title}</h2>
      {children}
    </section>
  );
}

function SkillBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mb-4">
      <p
        className="mb-2 font-pixel text-xs"
        style={{ color: "var(--subtle)" }}
      >
        {label}
      </p>
      <ul className="flex flex-wrap gap-2">
        {items.map((s) => (
          <li
            key={s}
            className="skin-chip px-2.5 py-1 font-terminal text-xs"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
