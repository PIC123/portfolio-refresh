import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectMedia from "@/components/ProjectMedia";
import { getProject, getProjects } from "@/lib/projects";
import { siteConfig } from "@/lib/site";
import { normalizeMediaList } from "@/types/Project";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const description =
    project.description.length > 160
      ? `${project.description.slice(0, 157)}…`
      : project.description;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${siteConfig.name}`,
      description,
      url: `/projects/${project.slug}`,
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const projects = getProjects();
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) notFound();

  const project = projects[i];
  const media = normalizeMediaList(project.images);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${siteConfig.url}/projects/${project.slug}`,
    dateCreated: project.startDate,
    creator: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    keywords: project.technologies?.map((t) => t.name).join(", "),
  };

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
      <Link
        href="/#projects"
        className="font-pixel text-[10px] text-white/60 hover:text-accent"
      >
        ← All projects
      </Link>

      <header className="mt-6 mb-8">
        {project.startDate && (
          <p className="mb-3 font-pixel text-xs text-accent">
            {project.startDate}
          </p>
        )}
        <h1 className="font-pixel text-2xl leading-snug md:text-4xl">
          {project.title}
        </h1>
      </header>

      {media.length > 0 && (
        <div className="space-y-4">
          {media.map((m, idx) => (
            <div
              key={`${m.src}-${idx}`}
              className="skin-card relative w-full overflow-hidden border border-white/20 bg-black"
              style={{
                aspectRatio:
                  m.width && m.height
                    ? `${m.width} / ${Math.min(m.height, m.width * 1.1)}`
                    : "16 / 9",
              }}
            >
              <ProjectMedia
                media={m}
                alt={`${project.title} — ${idx + 1} of ${media.length}`}
                sizes="(max-width: 896px) 100vw, 896px"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      )}

      <p className="mt-10 font-terminal text-lg leading-relaxed text-white/90">
        {project.description}
      </p>

      {project.technologies && project.technologies.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 font-pixel text-xs text-white/60">Built with</h2>
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <li
                key={t.name}
                className="rounded bg-white/10 px-2.5 py-1 font-terminal text-sm text-white/85"
              >
                {t.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(project.url || project.writeup) && (
        <div className="mt-10 flex flex-wrap gap-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-accent bg-accent/10 px-4 py-2 font-pixel text-xs text-accent transition hover:bg-accent hover:text-black"
            >
              View Project ↗
            </a>
          )}
          {project.writeup && (
            <a
              href={project.writeup}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-white/40 px-4 py-2 font-pixel text-xs transition hover:border-white hover:bg-white hover:text-black"
            >
              Read Writeup ↗
            </a>
          )}
        </div>
      )}

      <nav
        aria-label="More projects"
        className="mt-16 grid gap-3 border-t border-white/15 pt-6 sm:grid-cols-2"
      >
        <Link
          href={`/projects/${prev.slug}`}
          className="skin-card border border-white/20 p-4 transition hover:border-accent"
        >
          <span className="block font-pixel text-[9px] text-white/50">
            ← Previous
          </span>
          <span className="mt-2 block font-pixel text-xs">{prev.title}</span>
        </Link>
        <Link
          href={`/projects/${next.slug}`}
          className="skin-card border border-white/20 p-4 text-right transition hover:border-accent"
        >
          <span className="block font-pixel text-[9px] text-white/50">
            Next →
          </span>
          <span className="mt-2 block font-pixel text-xs">{next.title}</span>
        </Link>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
