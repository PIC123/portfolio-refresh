"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Project } from "@/types/Project";
import projectsData from "@/data/portfolio.json";

export default function ProjectsGallery() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(projectsData.projects);
  }, []);

  return (
    <section className="mt-12 space-y-16">
      <h2 className="text-3xl font-pixel mb-8">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.map((project) => (
          <Link
            href={project.url || "#"}
            key={project.id}
            className="group border border-white p-4 rounded hover:bg-white hover:text-black transition-colors duration-300"
          >
            <div className="mb-4 overflow-hidden rounded shadow">
              <Image
                src={project.images?.[0] || "/fallback.png"}
                alt={project.title}
                width={600}
                height={400}
                className="object-cover w-full h-60 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xl font-pixel mb-2">{project.title}</h3>
            <p className="text-sm font-terminal leading-relaxed">
              {project.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
