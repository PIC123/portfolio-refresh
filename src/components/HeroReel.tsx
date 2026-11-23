"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type ReelClip = {
  slug: string;
  title: string;
  year?: string;
  src: string;
  webm?: string;
  poster: string;
};

const CLIP_MS = 6000;

/**
 * The work, above the fold. Cycles through the featured projects' clips in a
 * framed "screen". Only the active clip has a <video> element, so one file
 * downloads at a time; the poster paints instantly underneath.
 */
export default function HeroReel({ clips }: { clips: ReelClip[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion.current) setPaused(true);
  }, []);

  useEffect(() => {
    if (paused || clips.length < 2) return;
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % clips.length),
      CLIP_MS,
    );
    return () => clearTimeout(id);
  }, [index, paused, clips.length]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) v.pause();
    else void v.play().catch(() => {});
  }, [paused, index]);

  if (clips.length === 0) return null;
  const clip = clips[index];

  return (
    <figure className="w-full">
      <div className="skin-card reel-scanlines relative aspect-[4/3] w-full overflow-hidden border border-white/30 bg-black">
        {/* Poster first so there is never an empty frame while video loads. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={clip.poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60 blur-sm scale-110"
        />
        <video
          key={clip.slug}
          ref={videoRef}
          poster={clip.poster}
          muted
          loop
          playsInline
          autoPlay={!paused}
          preload="metadata"
          aria-label={`Footage from ${clip.title}`}
          className="absolute inset-0 h-full w-full object-contain"
        >
          {clip.webm && <source src={clip.webm} type="video/webm" />}
          <source src={clip.src} type="video/mp4" />
        </video>

        <div className="absolute left-2 top-2 z-10 flex items-center gap-2 bg-black/70 px-2 py-1 font-pixel text-[9px] text-accent">
          <span aria-hidden="true">{paused ? "❚❚" : "●"}</span>
          <span>
            REEL {index + 1}/{clips.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play reel" : "Pause reel"}
          className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center border border-white/40 bg-black/70 font-pixel text-[10px] hover:bg-white hover:text-black transition"
        >
          {paused ? "►" : "❚❚"}
        </button>
      </div>

      <figcaption className="mt-3 flex items-center justify-between gap-3">
        <Link
          href={`/projects/${clip.slug}`}
          className="min-w-0 truncate font-pixel text-[10px] text-white/80 hover:text-accent"
        >
          {clip.title}
          {clip.year && <span className="text-white/50"> · {clip.year}</span>} →
        </Link>
        <div className="flex shrink-0 gap-1.5">
          {clips.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${c.title}`}
              aria-current={i === index}
              className={`h-2.5 w-5 border transition ${
                i === index
                  ? "border-accent bg-accent"
                  : "border-white/40 hover:border-white"
              }`}
            />
          ))}
        </div>
      </figcaption>
    </figure>
  );
}
