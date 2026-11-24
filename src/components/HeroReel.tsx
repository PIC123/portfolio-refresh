"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

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
 * The work, above the fold: a swipeable carousel of the featured projects.
 *
 * It is a native scroll-snap strip, so touch swipes, trackpad scrolls and
 * arrow keys all work without gesture code. It advances on its own until the
 * visitor takes over, then stays where they put it. Only the active slide
 * has a <video>, so one clip downloads at a time.
 */
export default function HeroReel({ clips }: { clips: ReelClip[] }) {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const stripRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Set while we scroll programmatically, so that scroll isn't mistaken for
  // the visitor taking over.
  const selfScrolling = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAuto(false);
    }
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const strip = stripRef.current;
      if (!strip || clips.length === 0) return;
      const next = (i + clips.length) % clips.length;
      selfScrolling.current = true;
      strip.scrollTo({ left: next * strip.clientWidth, behavior: "smooth" });
      setTimeout(() => (selfScrolling.current = false), 700);
    },
    [clips.length],
  );

  useEffect(() => {
    if (!auto || clips.length < 2) return;
    const id = setTimeout(() => goTo(index + 1), CLIP_MS);
    return () => clearTimeout(id);
  }, [auto, index, goTo, clips.length]);

  useEffect(() => {
    void videoRef.current?.play().catch(() => {});
  }, [index]);

  const onScroll = () => {
    const strip = stripRef.current;
    if (!strip) return;
    const i = Math.round(strip.scrollLeft / strip.clientWidth);
    if (i !== index && i >= 0 && i < clips.length) setIndex(i);
  };

  const takeOver = () => {
    if (!selfScrolling.current) setAuto(false);
  };

  if (clips.length === 0) return null;
  const clip = clips[index];

  return (
    <figure className="w-full">
      <div className="skin-card relative overflow-hidden border border-white/30 bg-black">
        <div
          ref={stripRef}
          onScroll={onScroll}
          onPointerDown={takeOver}
          onWheel={takeOver}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setAuto(false);
              goTo(index + 1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              setAuto(false);
              goTo(index - 1);
            }
          }}
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          aria-label="Featured project footage"
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        >
          {clips.map((c, i) => (
            <div
              key={c.slug}
              aria-hidden={i !== index}
              className="reel-scanlines relative aspect-[4/3] w-full shrink-0 snap-center overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.poster}
                alt=""
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-sm"
              />
              {i === index ? (
                <video
                  ref={videoRef}
                  poster={c.poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  aria-label={`Footage from ${c.title}`}
                  className="absolute inset-0 h-full w-full object-contain"
                >
                  {c.webm && <source src={c.webm} type="video/webm" />}
                  <source src={c.src} type="video/mp4" />
                </video>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.poster}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              )}
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute left-2 top-2 z-10 flex items-center gap-2 bg-black/70 px-2 py-1 font-pixel text-[9px] text-accent">
          <span aria-hidden="true">{auto ? "●" : "❚❚"}</span>
          <span>
            REEL {index + 1}/{clips.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setAuto((a) => !a)}
          aria-label={auto ? "Stop auto-advance" : "Resume auto-advance"}
          className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center border border-white/40 bg-black/70 font-pixel text-[10px] transition hover:bg-white hover:text-black"
        >
          {auto ? "❚❚" : "►"}
        </button>

        {clips.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => {
                setAuto(false);
                goTo(index - 1);
              }}
              aria-label="Previous project"
              className="absolute left-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/60 font-pixel text-sm transition hover:bg-white hover:text-black"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => {
                setAuto(false);
                goTo(index + 1);
              }}
              aria-label="Next project"
              className="absolute right-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/60 font-pixel text-sm transition hover:bg-white hover:text-black"
            >
              ›
            </button>
          </>
        )}
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
              onClick={() => {
                setAuto(false);
                goTo(i);
              }}
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
