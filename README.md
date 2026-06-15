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

## Skins (experimental)

A skin switcher in the nav reskins the whole site between six themes
(`terminal`, `winamp-classic`, `llama`, `matrix`, `vaporwave`, `gameboy`).
Each is a CSS-variable block in `globals.css`; per-skin widgets live in
`src/components/skins/` and are lazy-loaded so the default skin stays light.
Choice persists in `localStorage` and is applied before paint by an inline
script (no theme flash).

### Winamp audio

`winamp-classic` is a **real, working audio player**. It uses a small Web
Audio engine (`src/lib/audio/engine.ts`) that synthesizes music live — so
there are no audio files to ship and no licensing concerns. A real
`AnalyserNode` drives the spectrum visualizer, and the 10-band graphic EQ is
real (draggable biquad filters you can hear). The playlist tracks are named
after Phil's projects. On mobile it collapses into a bottom dock.

**To play real songs instead of (or alongside) the synth tracks**, drop a
file in `public/audio/` or use a stream URL, then add a track in
`src/lib/audio/tracks.ts`:

```ts
{
  id: "my-track",
  kind: "file",
  title: "My Track",
  subtitle: "2025",
  src: "/audio/my-track.mp3", // or an https:// stream URL
  lengthSec: 184,
}
```

File tracks route through the same graph, so the visualizer and EQ work on
them too. (Cross-origin streams need CORS headers for the analyser to read
their data.)

## Deployment

Designed for Vercel. Set `NEXT_PUBLIC_SITE_URL` in the project's environment variables.

## Notes

- Large GIFs in `public/images/` (notably `INTER-suit-experience-1.gif`) should be converted to MP4/WebM and served via `<video autoplay muted loop playsinline>` to dramatically reduce bundle size. This is a follow-up — `ffmpeg` was not available in the environment when the audit was run.
