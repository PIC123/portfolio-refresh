export const siteConfig = {
  name: "Phil Cherner",
  shortName: "PC",
  title: "Phil Cherner — Creative Technologist",
  description:
    "Creative technologist, researcher, and storyteller working at the intersection of art, design, and AI. MIT Media Lab.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://philcherner.com",
  email: "pcherner@mit.edu",
  location: "Cambridge, MA",
  social: {
    github: "https://github.com/PIC123",
    linkedin: "https://www.linkedin.com/in/pcherner/",
  },
  keywords: [
    "Phil Cherner",
    "creative technologist",
    "MIT Media Lab",
    "generative AI",
    "XR",
    "VR",
    "AR",
    "interactive installations",
    "TouchDesigner",
    "Unity",
  ],
} as const;
