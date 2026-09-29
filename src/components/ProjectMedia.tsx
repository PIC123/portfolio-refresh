"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { ProjectMedia } from "@/types/Project";

const FALLBACK_IMAGE = "/images/ascii-self.png";

type Props = {
  media?: ProjectMedia;
  alt: string;
  sizes: string;
  /** Card thumbnails only need a still; the modal plays the clip. */
  still?: boolean;
  priority?: boolean;
  className?: string;
};

/**
 * Renders one piece of project media.
 *
 * Videos replace what used to be multi-megabyte GIFs. They're muted, looped
 * and `playsInline` so they behave like a GIF, but cost ~2% of the bytes.
 * `object-contain` is deliberate: project media is a mix of portrait and
 * landscape, and `cover` was slicing a thin band out of the tall ones.
 */
export default function ProjectMedia({
  media,
  alt,
  sizes,
  still = false,
  priority = false,
  className = "",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only play while on screen — keeps offscreen clips from burning battery.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [media]);

  if (!media) {
    return (
      <Image
        src={FALLBACK_IMAGE}
        alt={alt}
        width={960}
        height={1440}
        sizes={sizes}
        className={`h-full w-full object-contain ${className}`}
      />
    );
  }

  if (media.kind === "video") {
    // Thumbnails use the poster still: no video decoding in a 14-card grid.
    if (still) {
      return (
        <Image
          src={media.poster}
          alt={alt}
          width={media.width}
          height={media.height}
          sizes={sizes}
          priority={priority}
          className={`h-full w-full object-contain ${className}`}
        />
      );
    }
    return (
      <video
        ref={videoRef}
        poster={media.poster}
        width={media.width}
        height={media.height}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label={alt}
        className={`h-full w-full object-contain ${className}`}
      >
        {/* WebM first: smaller, and preferred wherever VP9 is available.
            MP4/H.264 is the fallback Safari and iOS need. */}
        {media.webm && <source src={media.webm} type="video/webm" />}
        <source src={media.src} type="video/mp4" />
      </video>
    );
  }

  return (
    <Image
      src={media.src}
      alt={alt}
      width={media.width ?? 1280}
      height={media.height ?? 720}
      sizes={sizes}
      priority={priority}
      className={`h-full w-full object-contain ${className}`}
    />
  );
}
