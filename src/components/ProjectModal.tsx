"use client";

import { Project } from "@/types/Project";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  if (!project) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (project) setActiveImageIndex(0); // reset on modal open
  }, [project]);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          key="modal"
          className="bg-black border border-white rounded-lg p-6 max-w-3xl w-full text-white relative z-60 overflow-auto max-h-[90vh]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-red-400 text-xl"
          >
            ✕
          </button>

          <h2 className="text-2xl font-pixel mb-4">{project.title}</h2>

          {project.images && project.images.length > 0 && (
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded mb-4">
              <Image
                src={project.images[activeImageIndex]}
                alt={project.title}
                fill
                className="object-cover w-full h-full transition duration-500"
              />

              {project.images?.length && project.images?.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex(
                        (activeImageIndex - 1 + project.images!.length) %
                          project.images!.length
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-black bg-opacity-60 border border-white text-white rounded font-pixel text-lg hover:scale-110 hover:shadow-[0_0_6px_#fff] transition-all duration-200"
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex(
                        (activeImageIndex + 1) % project.images!.length
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-black bg-opacity-60 border border-white text-white rounded font-pixel text-lg hover:scale-110 hover:shadow-[0_0_6px_#fff] transition-all duration-200"
                  >
                    {">"}
                  </button>
                </>
              )}
            </div>
          )}

          <p className="mb-6 font-terminal text-sm leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-4">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition"
              >
                View Project
              </a>
            )}
            {project.writeup && (
              <a
                href={project.writeup}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition"
              >
                Read Writeup
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
