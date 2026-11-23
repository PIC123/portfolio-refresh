import Link from "next/link";
import LostGame from "@/components/fun/LostGame";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center px-6 py-16">
      <p className="font-pixel text-xs text-accent mb-3">ERROR 404</p>
      <h1 className="font-pixel text-3xl md:text-5xl mb-4">Page not found</h1>
      <p className="font-terminal text-lg text-white/75 mb-8">
        This page has drifted off into the void. While you&apos;re out here,
        collect some suit parts.
      </p>
      <LostGame />
      <Link
        href="/"
        className="mt-8 rounded border border-accent bg-accent/10 px-4 py-2 font-pixel text-xs text-accent hover:bg-accent hover:text-black transition"
      >
        ← Return home
      </Link>
    </section>
  );
}
