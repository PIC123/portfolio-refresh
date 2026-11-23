import Image from "next/image";
import Link from "next/link";
import portfolio from "@/data/portfolio.json";
import { siteConfig } from "@/lib/site";
import { getFeaturedProjects, getProjects } from "@/lib/projects";
import { normalizeMediaList } from "@/types/Project";
import AsciiSparkles from "@/components/AsciiSparkles";
import HeroReel, { type ReelClip } from "@/components/HeroReel";
import IntroHeading from "@/components/IntroHeading";
import ProjectsGallery from "@/components/ProjectsGallery";
import SectionDivider from "@/components/SectionDivider";

export default function HomePage() {
  const projects = getProjects();

  // One clip per featured project: its first video.
  const clips: ReelClip[] = getFeaturedProjects().flatMap((p) => {
    const video = normalizeMediaList(p.images).find((m) => m.kind === "video");
    if (!video || video.kind !== "video") return [];
    return [
      {
        slug: p.slug,
        title: p.title,
        year: p.startDate,
        src: video.src,
        webm: video.webm,
        poster: video.poster,
      },
    ];
  });

  return (
    <>
      <section className="relative mx-auto w-full max-w-6xl px-4 pt-14 pb-12 sm:px-6 lg:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-50 lg:block"
        >
          <AsciiSparkles />
        </div>

        <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:gap-14">
          <div className="w-full lg:w-1/2">
            <IntroHeading
              name={portfolio.name}
              tagline={portfolio.headerTaglineThree.trim()}
            />
            <p className="mt-4 text-xs text-white/60 font-pixel">
              {portfolio.headerTaglineFour}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <Link
                href="/#projects"
                className="rounded border border-accent bg-accent/10 px-4 py-2 font-pixel text-xs text-accent transition hover:bg-accent hover:text-black"
              >
                See the work
              </Link>
              <Link
                href="/#contact"
                className="rounded border border-white/40 px-4 py-2 font-pixel text-xs transition hover:border-white hover:bg-white hover:text-black"
              >
                Get in Touch
              </Link>
            </div>
            <p className="mt-8 hidden font-terminal text-xs text-white/40 lg:block">
              psst — press <kbd className="border border-white/30 px-1">`</kbd>{" "}
              for a shell.
            </p>
          </div>

          <div className="w-full lg:w-1/2">
            <HeroReel clips={clips} />
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
      >
        <ProjectsGallery projects={projects} />
      </section>

      <SectionDivider />

      <section
        id="about"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6"
      >
        <h2 className="mb-8 font-pixel text-2xl md:text-3xl">About</h2>
        <div className="flex flex-col items-start gap-10 lg:flex-row">
          <div className="flex-1 space-y-4 text-lg leading-relaxed text-white/85">
            <p>{portfolio.aboutParaOne}</p>
            <p>{portfolio.aboutParaTwo}</p>
            <p>{portfolio.aboutParaThree}</p>
            <p>
              <Link
                href="/resume"
                className="font-pixel text-xs text-accent underline-offset-4 hover:underline"
              >
                Full resume →
              </Link>
            </p>
          </div>
          <div className="w-full max-w-xs flex-shrink-0 self-center">
            <Image
              src="/images/ascii-self.png"
              alt={`Portrait of ${portfolio.name} Cherner rendered as ASCII art`}
              width={960}
              height={1440}
              className="skin-card border border-white/30 w-full h-auto"
              sizes="(max-width: 1024px) 80vw, 320px"
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="mb-6 font-pixel text-2xl md:text-3xl">Current Focus</h2>
        <p className="text-lg leading-relaxed text-white/85">
          I&apos;m currently exploring the intersection of AI and creative
          expression — building systems that collaborate with humans to
          generate unexpected and meaningful outcomes. I&apos;m also fascinated
          by spatial computing and building new types of tools for collective
          exploration and storytelling.
        </p>
      </section>

      <SectionDivider />

      <section
        id="contact"
        className="mx-auto w-full max-w-4xl scroll-mt-24 px-4 pb-24 pt-16 sm:px-6"
      >
        <h2 className="mb-6 font-pixel text-2xl md:text-3xl">
          Let&apos;s Build Something
        </h2>
        <p className="mb-8 text-lg leading-relaxed text-white/85">
          I&apos;m always excited to collaborate on new ideas — whether
          you&apos;re looking for a creative technologist, a research partner,
          or just someone to jam on weird and wonderful concepts with.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <a
            href={`mailto:${siteConfig.email}`}
            className="rounded border border-accent bg-accent/10 px-4 py-2 font-pixel text-xs text-accent transition hover:bg-accent hover:text-black"
          >
            Send Email
          </a>
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-white/40 px-4 py-2 font-pixel text-xs transition hover:border-white hover:bg-white hover:text-black"
          >
            GitHub ↗
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-white/40 px-4 py-2 font-pixel text-xs transition hover:border-white hover:bg-white hover:text-black"
          >
            LinkedIn ↗
          </a>
        </div>
      </section>
    </>
  );
}
