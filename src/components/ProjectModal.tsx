"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/types/Project";

type Props = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const imageCount = project?.images?.length ?? 0;

  const next = useCallback(() => {
    if (imageCount === 0) return;
    setActiveImageIndex((i) => (i + 1) % imageCount);
  }, [imageCount]);

  const prev = useCallback(() => {
    if (imageCount === 0) return;
    setActiveImageIndex((i) => (i - 1 + imageCount) % imageCount);
  }, [imageCount]);

  useEffect(() => {
    if (!project) return;
    setActiveImageIndex(0);
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
      previouslyFocused.current?.focus?.();
    };
  }, [project, onClose, next, prev]);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            ref={dialogRef}
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-white/40 bg-black p-6 text-white shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="absolute top-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded border border-white/30 text-xl hover:border-white hover:bg-white hover:text-black transition"
            >
              ×
            </button>

            <h2
              id="modal-title"
              className="pr-12 font-pixel text-xl md:text-2xl mb-1"
            >
              {project.title}
            </h2>
            {project.startDate && (
              <p className="mb-4 font-terminal text-xs text-white/60">
                {project.startDate}
              </p>
            )}

            {project.images && project.images.length > 0 && (
              <div
                className="relative w-full aspect-[16/9] overflow-hidden rounded mb-5 bg-black/60"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <Image
                  src={project.images[activeImageIndex]}
                  alt={`${project.title} — image ${activeImageIndex + 1} of ${project.images.length}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                  unoptimized={project.images[activeImageIndex]?.endsWith(".gif")}
                />

                {project.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prev}
                      aria-label="Previous image"
                      className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/60 font-pixel text-sm hover:bg-white hover:text-black transition"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      aria-label="Next image"
                      className="absolute right-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/60 font-pixel text-sm hover:bg-white hover:text-black transition"
                    >
                      ›
                    </button>
                    <div
                      aria-hidden="true"
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-2 py-0.5 font-terminal text-xs"
                    >
                      {activeImageIndex + 1} / {project.images.length}
                    </div>
                  </>
                )}
              </div>
            )}

            <p className="mb-6 font-terminal text-sm leading-relaxed text-white/85">
              {project.description}
            </p>

            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-2 font-pixel text-xs">Technologies</h3>
                <ul className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <li
                      key={t.name}
                      className="rounded bg-white/10 px-2 py-1 font-terminal text-xs text-white/80"
                    >
                      {t.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-accent bg-accent/10 px-4 py-2 font-pixel text-xs text-accent hover:bg-accent hover:text-black transition"
                >
                  View Project ↗
                </a>
              )}
              {project.writeup && (
                <a
                  href={project.writeup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-white/40 px-4 py-2 font-pixel text-xs hover:border-white hover:bg-white hover:text-black transition"
                >
                  Read Writeup ↗
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
