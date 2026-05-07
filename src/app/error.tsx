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
      <p className="font-pixel text-xs text-accent-alt mb-3">SYSTEM ERROR</p>
      <h1 className="font-pixel text-3xl md:text-5xl mb-4">
        Something broke
      </h1>
      <p className="font-terminal text-lg text-white/75 mb-8">
        An unexpected error occurred. You can try again, or head back home.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded border border-accent bg-accent/10 px-4 py-2 font-pixel text-xs text-accent hover:bg-accent hover:text-black transition"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded border border-white/40 px-4 py-2 font-pixel text-xs hover:border-white hover:bg-white hover:text-black transition"
        >
          ← Home
        </Link>
      </div>
    </section>
  );
}
