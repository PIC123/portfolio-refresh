"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { normalizeMediaList, type Project } from "@/types/Project";
import ProjectMedia from "@/components/ProjectMedia";

type Props = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const media = useMemo(
    () => normalizeMediaList(project?.images),
    [project?.images],
  );
  const count = media.length;

  const next = useCallback(() => {
    if (count === 0) return;
    setActiveIndex((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (count === 0) return;
    setActiveIndex((i) => (i - 1 + count) % count);
  }, [count]);

  // Reset the carousel only when the project itself changes — not when an
  // unrelated parent re-render hands us a new callback identity.
  useEffect(() => {
    setActiveIndex(0);
  }, [project?.id]);

  // Focus management + scroll lock, keyed on open/close only.
  const isOpen = project !== null;
  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const restore = previouslyFocused.current;
    return () => {
      document.body.style.overflow = original;
      restore?.focus?.();
    };
  }, [isOpen]);

  // Keyboard: Esc, arrows, and a focus trap.
  useEffect(() => {
    if (!isOpen) return;
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
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, next, prev]);

  // Touch swipe between media.
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
    touchStartX.current = null;
  };

  // Only close when the press *starts* on the backdrop — otherwise dragging a
  // selection from inside the dialog and releasing outside would close it.
  const pressStartedOnBackdrop = useRef(false);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            pressStartedOnBackdrop.current = e.target === e.currentTarget;
          }}
          onMouseUp={(e) => {
            if (pressStartedOnBackdrop.current && e.target === e.currentTarget) {
              onClose();
            }
            pressStartedOnBackdrop.current = false;
          }}
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
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="absolute top-3 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded border border-white/30 bg-black/70 text-xl hover:border-white hover:bg-white hover:text-black transition"
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

            {count > 0 && (
              <div
                className="relative w-full aspect-[16/9] overflow-hidden rounded mb-5 bg-black/60"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                <ProjectMedia
                  key={activeIndex}
                  media={media[activeIndex]}
                  alt={`${project.title} — ${activeIndex + 1} of ${count}`}
                  sizes="(max-width: 768px) 100vw, 768px"
                />

                {count > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prev}
                      aria-label="Previous media"
                      className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/60 font-pixel text-sm hover:bg-white hover:text-black transition"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      aria-label="Next media"
                      className="absolute right-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/60 font-pixel text-sm hover:bg-white hover:text-black transition"
                    >
                      ›
                    </button>
                    <div
                      aria-hidden="true"
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-2 py-0.5 font-terminal text-xs"
                    >
                      {activeIndex + 1} / {count}
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
