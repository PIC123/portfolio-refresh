"use client";

import { motion } from "framer-motion";

import ProjectsGallery from "@/components/ProjectsGallery";
import AsciiSparkles from "@/components/AsciiSparkles";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-black text-white font-terminal text-left">
      {/* ✅ INTRO SECTION: Split left/right */}
      <section className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 pt-48 px-4">
        <div className="w-full lg:w-2/3">
          <motion.h1
            className="text-4xl md:text-6xl font-pixel mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <span className="animate-typing overflow-hidden whitespace-nowrap border-r-2 border-white pr-2">
              Hi, I&apos;m Phil
            </span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl max-w-2xl font-terminal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Creative Technologist | Researcher | Storyteller at the Intersection
            of Art, Design & AI
          </motion.p>
        </div>

        <div className="hidden lg:block w-full lg:w-1/3 relative pointer-events-none">
          <AsciiSparkles />
        </div>
      </section>

      {/* ✅ WHAT I DO */}
      <section id="what-i-do" className="max-w-4xl mx-auto w-full px-4 py-24">
        <h2 className="text-3xl font-pixel mb-6">What I Do</h2>
        <p className="text-lg mb-4">
          I build immersive, interactive experiences that bridge the digital and
          physical worlds — whether it’s through XR, AI-driven art, or
          large-scale festival installations. My goal is to create joyful,
          thoughtful technology that connects people and inspires wonder.
        </p>
        <p className="text-lg mb-4">
          From AI-powered storytelling apps to VR data environments, my work
          explores how we interact with emerging tech, and how that tech can
          feel more human.
        </p>
        <div className="my-8 text-white-400 text-xs">
          {Array(80).fill("-").join("")}
        </div>
      </section>

      {/* ✅ FULL-WIDTH PROJECTS SECTION */}
      <section id="projects" className="w-full px-6 sm:px-12 lg:px-24 xl:px-32">
        <ProjectsGallery />
      </section>

      {/* About Section */}
      <section
        id="about"
        className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-24 flex flex-col lg:flex-row gap-8 items-center"
      >
        <div className="flex-1">
          <h2 className="text-3xl font-pixel mb-6">About Me</h2>
          <p className="text-lg font-terminal leading-relaxed mb-4">
            I&apos;m a highly motivated engineer with years of experience
            working in fast-paced, interdisciplinary environments. I have a very
            strong background in C#, Javascript/Typescript, Python and Unity.
            With experience creating applications for a range of AR/VR
            technologies, I&apos;m passionate about building new technologies
            and experiences that inspire in order to develop the future of
            human/computer interaction.
          </p>
          <p className="text-lg font-terminal leading-relaxed mb-4">
            I recently completed my Masters in AI at MIT and am doing research
            at the MIT Media Lab under Prof. Dava Newman, combining generative
            AI, mixed reality, and climate data. Previously I have worked at
            Microsoft on the Commercial Software Engineering team (CSE) where we
            collaborate with Microsoft’s top partners, ranging from start-ups to
            fortune 500 companies across many industries. We work alongside
            their lead engineers, developing solutions to solve the company’s
            toughest technical problems.
          </p>
          <p className="text-lg font-terminal leading-relaxed">
            Before that, I was doing research in the Fluid Interfaces group at
            the MIT Media Lab and worked with the Robot Locomotion Group in MIT
            CSAIL while studying Electrical Engineering & Computer Science at
            MIT.
          </p>
        </div>

        <div className="flex-shrink-0 w-full max-w-sm">
          <img
            src="/images/ascii-self.png" // Replace with your actual image path
            alt="Phil Cherner"
            className="rounded border border-white w-full object-cover"
          />
        </div>
      </section>

      {/* ✅ CURRENT FOCUS */}
      <section className="max-w-4xl mx-auto w-full px-4 py-24">
        <h2 className="text-3xl font-pixel mb-6">Current Focus</h2>
        <p className="text-lg mb-4">
          I’m currently exploring the intersection of AI and creative
          expression—building systems that collaborate with humans to generate
          unexpected and meaningful outcomes. I’m also fascinated by spatial
          computing and building new types of tools for collective exploration
          and storytelling.
        </p>
        <div className="my-8 text-white-400 text-xs">
          {Array(80).fill("-").join("")}
        </div>
      </section>

      {/* ✅ LETS BUILD SOMETHING */}
      <section id="contact" className="max-w-4xl mx-auto w-full px-4 pb-32">
        <h2 className="text-3xl font-pixel mb-6">Let&apos;s Build Something</h2>
        <p className="text-lg mb-4">
          I&apos;m always excited to collaborate on new ideas, whether
          you&apos;re looking for a creative technologist, a research partner,
          or just someone to jam on weird and wonderful concepts with.
          Let&apos;s connect!
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <a
            href="mailto:pcherner@mit.edu"
            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition"
          >
            Send Email
          </a>
          <a
            href="https://github.com/PIC123"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/pcherner/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition"
          >
            LinkedIn
          </a>
        </div>
        <div className="my-8 text-white-400 text-xs">
          {Array(80).fill("-").join("")}
        </div>
      </section>
    </main>
  );
}
