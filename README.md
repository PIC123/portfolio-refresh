# Phil Cherner — Portfolio

Personal portfolio site for Phil Cherner: creative technologist, researcher, and storyteller working at the intersection of art, design, and AI.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS 4
- [Framer Motion](https://www.framer.com/motion/) for animations
- `next/font` for Press Start 2P + Share Tech Mono
- Native Next.js metadata, sitemap, robots, and Open Graph image generation

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script         | Purpose                  |
| -------------- | ------------------------ |
| `npm run dev`  | Dev server (Turbopack)   |
| `npm run build`| Production build         |
| `npm run start`| Run the production build |
| `npm run lint` | ESLint                   |

## Project structure

```
src/
├── app/                 App Router pages, layout, metadata, sitemap
│   ├── opengraph-image  Generated 1200×630 OG image
│   ├── resume/          Resume page rendered from data/portfolio.json
│   └── writeups/        Writeups index (placeholder content)
├── components/          UI components (Nav, ProjectsGallery, ProjectModal, …)
├── data/portfolio.json  All project, resume, and bio content
├── lib/site.ts          Site-wide metadata constants
└── types/Project.ts     Shared TypeScript types
```

Content lives in `src/data/portfolio.json` — edit there, no code changes needed for new projects.

## Deployment

Designed for Vercel. Set `NEXT_PUBLIC_SITE_URL` in the project's environment variables.

## Notes

- Large GIFs in `public/images/` (notably `INTER-suit-experience-1.gif`) should be converted to MP4/WebM and served via `<video autoplay muted loop playsinline>` to dramatically reduce bundle size. This is a follow-up — `ffmpeg` was not available in the environment when the audit was run.
