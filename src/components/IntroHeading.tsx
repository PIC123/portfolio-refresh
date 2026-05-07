"use client";

import { motion } from "framer-motion";

type Props = {
  name: string;
  tagline: string;
};

export default function IntroHeading({ name, tagline }: Props) {
  const greeting = `Hi, I'm ${name}`;
  const steps = greeting.length;
  const duration = `${(steps * 0.09).toFixed(2)}s`;

  return (
    <>
      <motion.h1
        className="font-pixel text-3xl leading-tight md:text-5xl lg:text-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <span
          className="animate-typing"
          style={
            {
              ["--typing-steps" as string]: steps,
              ["--typing-duration" as string]: duration,
            } as React.CSSProperties
          }
        >
          {greeting}
        </span>
      </motion.h1>
      <motion.p
        className="mt-5 max-w-2xl text-lg md:text-2xl text-white/80"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        {tagline}
      </motion.p>
    </>
  );
}
