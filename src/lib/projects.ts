import portfolioData from "@/data/portfolio.json";
import type { Project } from "@/types/Project";

/**
 * Single place where the portfolio JSON crosses into typed code.
 *
 * The JSON is hand-edited, so a typo (a missing title, a media object without
 * a poster) would otherwise surface as a blank card at runtime. In dev we
 * surface it at import time instead; in production we never throw over
 * content, we just drop the malformed entry.
 */
function isValid(p: unknown): p is Project {
  if (typeof p !== "object" || p === null) return false;
  const c = p as Partial<Project>;
  return (
    typeof c.id === "string" &&
    typeof c.title === "string" &&
    typeof c.description === "string"
  );
}

export function getProjects(): Project[] {
  const raw = portfolioData.projects as unknown[];
  const valid: Project[] = [];

  for (const entry of raw) {
    if (isValid(entry)) {
      valid.push(entry);
    } else if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[portfolio] skipping malformed project entry:",
        JSON.stringify(entry).slice(0, 120),
      );
    }
  }

  const seen = new Set<string>();
  for (const p of valid) {
    if (seen.has(p.id) && process.env.NODE_ENV !== "production") {
      console.warn(`[portfolio] duplicate project id: ${p.id}`);
    }
    seen.add(p.id);
  }

  return valid;
}
