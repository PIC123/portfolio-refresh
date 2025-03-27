'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { sections } from "@/data/sections";

export default function HomePage() {
  const introRef = useRef(null);
  const isIntroInView = useInView(introRef);

  return (
    <main className="min-h-screen flex flex-col gap-24 bg-black text-white font-terminal text-left">
      <section className="pt-48 w-full px-4">
        <motion.h1
          className="text-4xl md:text-6xl font-pixel mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <span className="animate-typing overflow-hidden whitespace-nowrap border-r-2 border-white pr-2">
            Hi, I'm Phil
          </span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl max-w-2xl font-terminal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Creative Technologist | Researcher | Storyteller at the Intersection of Art, Design & AI
        </motion.p>
      </section>

      {sections.map((section, index) => (
        <motion.section
          key={section.title}
          className="max-w-4xl px-4 font-terminal"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 * index }}
        >
          <h2 className="text-3xl font-pixel mb-6">{section.title}</h2>
          {section.content.map((text, idx) => (
            <p key={idx} className="text-lg mb-4">
              {text}
            </p>
          ))}
          <div className="my-8 text-white-400 text-xs">
            {Array(80).fill('-').join('')}
          </div>
        </motion.section>
      ))}
    </main>
  );
}