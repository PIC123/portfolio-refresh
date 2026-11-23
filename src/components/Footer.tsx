import Link from "next/link";
import { siteConfig } from "@/lib/site";
import EggCounter from "@/components/fun/EggCounter";

export default function Footer() {
  return (
    <footer className="relative z-[1] border-t border-white/15">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-terminal text-sm text-white/60">
          © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.location}
        </p>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-pixel text-[9px] text-white/60">
          <li>
            <Link href="/resume" className="hover:text-accent">
              Resume
            </Link>
          </li>
          <li>
            <a href={`mailto:${siteConfig.email}`} className="hover:text-accent">
              Email
            </a>
          </li>
          <li>
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <EggCounter />
          </li>
        </ul>
      </div>
    </footer>
  );
}
