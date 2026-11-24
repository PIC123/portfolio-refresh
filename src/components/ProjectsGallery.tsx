"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeMediaList, type Project } from "@/types/Project";
import ProjectMedia from "@/components/ProjectMedia";
import ProjectModal from "@/components/ProjectModal";

type Props = {
  projects: Project[];
};

// A filter only earns a pill if it narrows to more than one project.
const MIN_PROJECTS_PER_FILTER = 2;

export default function ProjectsGallery({ projects }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Stable identity: ProjectModal binds effects to this, and a fresh closure
  // each render would reset the carousel and steal focus mid-view.
  const closeModal = useCallback(() => setSelectedProject(null), []);

  const featured = useMemo(() => projects.filter((p) => p.featured), [projects]);
  const archive = useMemo(() => projects.filter((p) => !p.featured), [projects]);

  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    archive.forEach((p) =>
      p.technologies?.forEach((t) =>
        counts.set(t.name, (counts.get(t.name) ?? 0) + 1),
      ),
    );
    const names = [...counts.entries()]
      .filter(([, n]) => n >= MIN_PROJECTS_PER_FILTER)
      .map(([name]) => name)
      .sort();
    return ["All", ...names];
  }, [archive]);

  const visible = useMemo(() => {
    if (activeFilter === "All") return archive;
    return archive.filter((p) =>
      p.technologies?.some((t) => t.name === activeFilter),
    );
  }, [archive, activeFilter]);

  return (
    <section aria-labelledby="projects-heading" className="w-full">
      <h2
        id="projects-heading"
        className="mb-8 font-pixel text-2xl md:text-3xl"
      >
        Selected Work
      </h2>

      <ul className="mb-20 grid gap-6 md:grid-cols-2">
        {featured.map((project, index) => {
          const media = normalizeMediaList(project.images);
          return (
            <li key={project.id}>
              <Link
                href={`/projects/${project.slug}`}
                className="skin-card group flex h-full flex-col border border-white/30 bg-white/[0.02] p-4 transition hover:border-accent hover:bg-white/[0.05]"
              >
                <div className="aspect-video w-full overflow-hidden rounded mb-4 bg-black">
                  <ProjectMedia
                    media={media[0]}
                    alt=""
                    priority={index < 2}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <h3 className="font-pixel text-base leading-snug md:text-lg">
                    {project.title}
                  </h3>
                  {project.startDate && (
                    <span className="shrink-0 font-pixel text-[10px] text-accent">
                      {project.startDate}
                    </span>
                  )}
                </div>
                <p className="font-terminal text-base leading-relaxed text-white/75 line-clamp-3">
                  {project.description}
                </p>
                <span className="mt-4 font-pixel text-[10px] text-white/60 group-hover:text-accent">
                  Read more →
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <h2 className="font-pixel text-xl md:text-2xl">Archive</h2>
        <p aria-live="polite" className="text-xs text-white/60 font-terminal">
          {visible.length} of {archive.length} shown
        </p>
      </div>

      {/* A plain group, not role="toolbar" — toolbar promises arrow-key
          navigation between controls, which these Tab-reachable buttons
          don't implement. */}
      <div
        role="group"
        aria-label="Filter archive by technology"
        className="mb-8 flex flex-wrap gap-2"
      >
        {filters.map((f) => {
          const isActive = f === activeFilter;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              aria-pressed={isActive}
              className={`px-3 py-1.5 font-pixel text-[10px] rounded border transition ${
                isActive
                  ? "border-accent bg-accent text-black"
                  : "border-white/30 text-white/70 hover:border-white hover:text-white"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <ul
        className="grid gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => {
            const media = normalizeMediaList(project.images);
            return (
              <motion.li
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.03, 0.3),
                }}
                className="list-none"
              >
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="skin-card group flex h-full w-full flex-col border border-white/30 bg-white/[0.02] p-3 text-left transition hover:border-accent hover:bg-white/[0.05] focus-visible:border-accent"
                  aria-label={`View details for ${project.title}`}
                >
                  <div className="aspect-video w-full overflow-hidden rounded mb-3 bg-black">
                    <ProjectMedia
                      media={media[0]}
                      alt=""
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <h3 className="font-pixel text-xs mb-2 leading-snug">
                    {project.title}
                    {project.startDate && (
                      <span className="ml-2 text-[10px] text-white/50">
                        {project.startDate}
                      </span>
                    )}
                  </h3>
                  <p className="font-terminal text-sm leading-relaxed text-white/70 line-clamp-2">
                    {project.description}
                  </p>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <ProjectModal project={selectedProject} onClose={closeModal} />
    </section>
  );
}
