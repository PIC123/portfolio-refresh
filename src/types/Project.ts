/** A single piece of project media — an image, or a looping silent video. */
export type ProjectMedia =
  | {
      kind: "image";
      src: string;
      width?: number;
      height?: number;
    }
  | {
      kind: "video";
      /** H.264 MP4 — universal fallback, notably Safari/iOS. */
      src: string;
      /** VP9 WebM — smaller, preferred by Chrome/Firefox when present. */
      webm?: string;
      poster: string;
      width: number;
      height: number;
    };

/**
 * In portfolio.json, media entries are either a bare URL string (image) or an
 * object with an explicit `kind`. Normalizing here keeps the data file terse
 * while giving components one shape to render.
 */
export type RawMedia =
  | string
  | {
      kind?: string;
      src: string;
      webm?: string;
      poster?: string;
      width?: number;
      height?: number;
    };

export function normalizeMedia(raw: RawMedia): ProjectMedia {
  if (typeof raw === "string") {
    return { kind: "image", src: raw };
  }
  if (raw.kind === "video" && raw.poster && raw.width && raw.height) {
    return {
      kind: "video",
      src: raw.src,
      webm: raw.webm,
      poster: raw.poster,
      width: raw.width,
      height: raw.height,
    };
  }
  return {
    kind: "image",
    src: raw.src,
    width: raw.width,
    height: raw.height,
  };
}

export function normalizeMediaList(raw: RawMedia[] | undefined): ProjectMedia[] {
  return (raw ?? []).map(normalizeMedia);
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  images?: RawMedia[];
  startDate?: string;
  writeup?: string;
  technologies?: Technology[];
}

export interface Technology {
  class: string;
  name: string;
}
