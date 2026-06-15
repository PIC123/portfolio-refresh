import Image from "next/image";
import Link from "next/link";
import portfolio from "@/data/portfolio.json";
import { siteConfig } from "@/lib/site";
import type { Project } from "@/types/Project";
import AsciiSparkles from "@/components/AsciiSparkles";
import IntroHeading from "@/components/IntroHeading";
import ProjectsGallery from "@/components/ProjectsGallery";
import SectionDivider from "@/components/SectionDivider";

export default function HomePage() {
  const projects = portfolio.projects as Project[];

  return (
    <>
      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-20 pb-12 sm:px-6 lg:flex-row lg:pt-32">
        <div className="w-full lg:w-2/3">
          <IntroHeading
            name={portfolio.name}
            tagline={portfolio.headerTaglineThree.trim()}
          />
          <p
            className="mt-4 font-pixel text-sm"
            style={{ color: "var(--muted)" }}
          >
            {portfolio.headerTaglineFour}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href="/#projects"
              className="skin-button-primary px-4 py-2 font-pixel text-xs"
            >
              View Projects
            </Link>
            <Link
              href="/#contact"
              className="skin-button px-4 py-2 font-pixel text-xs"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none relative hidden w-full lg:block lg:w-1/3"
        >
          <AsciiSparkles />
        </div>
      </section>

      <section
        id="what-i-do"
        className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6"
      >
        <h2 className="mb-6 font-pixel text-2xl md:text-3xl">What I Do</h2>
        <p
          className="mb-4 text-lg leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          I build immersive, interactive experiences that bridge the digital
          and physical worlds — whether it&apos;s through XR, AI-driven art,
          or large-scale festival installations. My goal is to create joyful,
          thoughtful technology that connects people and inspires wonder.
        </p>
        <p
          className="text-lg leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          From AI-powered storytelling apps to VR data environments, my work
          explores how we interact with emerging tech — and how that tech can
          feel more human.
        </p>
        <SectionDivider />
      </section>

      <section
        id="projects"
        className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <ProjectsGallery projects={projects} />
      </section>

      <SectionDivider />

      <section
        id="about"
        className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6"
      >
        <h2 className="mb-8 font-pixel text-2xl md:text-3xl">About Me</h2>
        <div className="flex flex-col items-start gap-10 lg:flex-row">
          <div
            className="flex-1 space-y-4 text-lg leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            <p>{portfolio.aboutParaOne}</p>
            <p>{portfolio.aboutParaTwo}</p>
            <p>{portfolio.aboutParaThree}</p>
          </div>
          <div className="w-full max-w-xs flex-shrink-0 self-center">
            <Image
              src="/images/ascii-self.png"
              alt={`Portrait of ${portfolio.name} Cherner rendered as ASCII art`}
              width={480}
              height={480}
              className="skin-surface w-full h-auto object-cover"
              sizes="(max-width: 1024px) 80vw, 320px"
            />
          </div>
        </div>
        <SectionDivider />
      </section>

      <section className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6">
        <h2 className="mb-6 font-pixel text-2xl md:text-3xl">Current Focus</h2>
        <p
          className="text-lg leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          I&apos;m currently exploring the intersection of AI and creative
          expression — building systems that collaborate with humans to
          generate unexpected and meaningful outcomes. I&apos;m also fascinated
          by spatial computing and building new types of tools for collective
          exploration and storytelling.
        </p>
        <SectionDivider />
      </section>

      <section
        id="contact"
        className="mx-auto w-full max-w-4xl px-4 pb-32 pt-12 sm:px-6"
      >
        <h2 className="mb-6 font-pixel text-2xl md:text-3xl">
          Let&apos;s Build Something
        </h2>
        <p
          className="mb-8 text-lg leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          I&apos;m always excited to collaborate on new ideas — whether
          you&apos;re looking for a creative technologist, a research partner,
          or just someone to jam on weird and wonderful concepts with.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <a
            href={`mailto:${siteConfig.email}`}
            className="skin-button-primary px-4 py-2 font-pixel text-xs"
          >
            Send Email
          </a>
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="skin-button px-4 py-2 font-pixel text-xs"
          >
            GitHub ↗
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="skin-button px-4 py-2 font-pixel text-xs"
          >
            LinkedIn ↗
          </a>
        </div>
      </section>
    </>
  );
}
