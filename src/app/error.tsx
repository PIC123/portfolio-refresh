"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center px-6 py-24">
      <p
        className="mb-3 font-pixel text-xs"
        style={{ color: "var(--accent-alt)" }}
      >
        SYSTEM ERROR
      </p>
      <h1 className="mb-4 font-pixel text-3xl md:text-5xl">
        Something broke
      </h1>
      <p
        className="mb-8 font-terminal text-lg"
        style={{ color: "var(--muted)" }}
      >
        An unexpected error occurred. You can try again, or head back home.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="skin-button-primary px-4 py-2 font-pixel text-xs"
        >
          Try again
        </button>
        <Link
          href="/"
          className="skin-button px-4 py-2 font-pixel text-xs"
        >
          ← Home
        </Link>
      </div>
    </section>
  );
}
