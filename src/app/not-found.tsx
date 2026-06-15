import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center px-6 py-24">
      <p
        className="mb-3 font-pixel text-xs"
        style={{ color: "var(--accent)" }}
      >
        ERROR 404
      </p>
      <h1 className="mb-4 font-pixel text-3xl md:text-5xl">Page not found</h1>
      <p
        className="mb-8 font-terminal text-lg"
        style={{ color: "var(--muted)" }}
      >
        The page you&apos;re looking for has drifted off into the void.
        Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        className="skin-button-primary px-4 py-2 font-pixel text-xs"
      >
        ← Return home
      </Link>
    </section>
  );
}
