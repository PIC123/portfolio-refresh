"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/types/Project";
import ProjectModal from "@/components/ProjectModal";

const FALLBACK_IMAGE = "/images/ascii-self.png";

type Props = {
  projects: Project[];
};

export default function ProjectsGallery({ projects }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filters = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach((p) =>
      p.technologies?.forEach((t) => techs.add(t.name)),
    );
    return ["All", ...Array.from(techs).sort()];
  }, [projects]);

  const visible = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((p) =>
      p.technologies?.some((t) => t.name === activeFilter),
    );
  }, [projects, activeFilter]);

  return (
    <section aria-labelledby="projects-heading" className="w-full">
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <h2 id="projects-heading" className="font-pixel text-2xl md:text-3xl">
          Projects
        </h2>
        <p
          className="font-terminal text-xs"
          style={{ color: "var(--muted)" }}
        >
          {visible.length} of {projects.length} shown
        </p>
      </div>

      <div
        role="toolbar"
        aria-label="Filter projects by technology"
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
              className={`px-3 py-1.5 font-pixel text-[10px] transition ${
                isActive ? "skin-button-primary" : "skin-button"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <ul
        className="grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
      >
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
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
                className="skin-surface group flex h-full w-full flex-col p-4 text-left transition"
                aria-label={`View details for ${project.title}`}
              >
                <div
                  className="aspect-video w-full overflow-hidden mb-4"
                  style={{ background: "rgba(0,0,0,0.4)" }}
                >
                  <Image
                    src={project.images?.[0] || FALLBACK_IMAGE}
                    alt=""
                    width={640}
                    height={360}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    unoptimized={project.images?.[0]?.endsWith(".gif")}
                  />
                </div>
                <h3 className="font-pixel text-base mb-2 leading-snug">
                  {project.title}
                  {project.startDate && (
                    <span
                      className="ml-2 text-xs"
                      style={{ color: "var(--subtle)" }}
                    >
                      {project.startDate}
                    </span>
                  )}
                </h3>
                <p
                  className="font-terminal text-sm leading-relaxed line-clamp-3"
                  style={{ color: "var(--muted)" }}
                >
                  {project.description}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 3).map((t) => (
                      <span
                        key={t.name}
                        className="skin-chip px-2 py-0.5 text-[10px] font-terminal"
                      >
                        {t.name}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span
                        className="text-[10px] font-terminal"
                        style={{ color: "var(--subtle)" }}
                      >
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
