"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Project } from "@/types/Project";
import projectsData from "@/data/portfolio.json";
import { motion } from "framer-motion";
import ProjectModal from "@/components/ProjectModal";

export default function ProjectsGallery() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    setProjects(projectsData.projects);
  }, []);

  return (
    <section className="mt-12 w-full">
      <h2 className="text-3xl font-pixel mb-8">Projects</h2>

      <div
        className="grid gap-8 w-full"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group border border-white p-4 rounded hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
            onClick={() => setSelectedProject(project)}
          >
            <div className="aspect-video overflow-hidden rounded mb-4 shadow">
              <Image
                src={project.images?.[0] || "/fallback.png"}
                alt={project.title}
                width={800}
                height={450}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xl font-pixel mb-2">{project.title}</h3>
            <p className="text-sm font-terminal leading-relaxed">
              {project.description}
            </p>
          </motion.div>
        ))}
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
