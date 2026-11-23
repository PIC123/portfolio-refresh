"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { EGGS, foundEggs, resetEggs, unlockEgg } from "@/lib/eggs";
import { SKINS, SKIN_IDS, isSkinId } from "@/lib/skins";
import { siteConfig } from "@/lib/site";
import { applySkin, currentSkin } from "@/components/skins/useSkin";
import { useAudio } from "@/components/skins/audio/AudioProvider";

export const TERMINAL_OPEN_EVENT = "pc-terminal-open";

export type TerminalProject = { slug: string; title: string; year?: string };

type Line = { kind: "in" | "out" | "err"; text: string };

const BANNER: Line[] = [
  { kind: "out", text: "phil.sh — type `help` to look around. Esc to close." },
];

/**
 * A real shell for the site: it navigates, changes skins and drives the
 * player. Opens on the backtick key or from the >_ button in the nav.
 */
export default function Terminal({ projects }: { projects: TerminalProject[] }) {
  const router = useRouter();
  const audio = useAudio();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const historyIndex = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (e.key === "`" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (typing && !open) return;
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener(TERMINAL_OPEN_EVENT, onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener(TERMINAL_OPEN_EVENT, onOpen);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    unlockEgg("terminal");
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, open]);

  const run = useCallback(
    (raw: string) => {
      const input = raw.trim();
      const out: Line[] = [{ kind: "in", text: input }];
      const say = (text: string) => out.push({ kind: "out", text });
      const fail = (text: string) => out.push({ kind: "err", text });
      const [cmd = "", ...rest] = input.split(/\s+/);
      const arg = rest.join(" ").toLowerCase();

      const go = (href: string, label: string) => {
        say(`→ ${label}`);
        router.push(href);
        setTimeout(close, 350);
      };

      switch (cmd.toLowerCase()) {
        case "":
          break;
        case "help":
          [
            "ls                 list projects",
            "open <project>     open a project page (try: open inter)",
            "about | resume | contact",
            "skin <name>        change skin · `skins` lists them",
            "play | pause | next | prev    drive the synth player",
            "secrets            easter-egg progress",
            "whoami | date | clear | exit",
          ].forEach(say);
          break;
        case "ls":
          projects.forEach((p) =>
            say(`${(p.year ?? "----").padEnd(6)}${p.slug.padEnd(24)}${p.title}`),
          );
          break;
        case "open":
        case "cd": {
          if (!arg) {
            fail("usage: open <project>");
            break;
          }
          const hit =
            projects.find((p) => p.slug === arg) ??
            projects.find(
              (p) => p.slug.includes(arg) || p.title.toLowerCase().includes(arg),
            );
          if (hit) go(`/projects/${hit.slug}`, hit.title);
          else fail(`no project matching "${arg}" — try \`ls\``);
          break;
        }
        case "about":
          go("/#about", "about");
          break;
        case "projects":
          go("/#projects", "projects");
          break;
        case "resume":
          go("/resume", "resume");
          break;
        case "home":
          go("/", "home");
          break;
        case "contact":
          say(siteConfig.email);
          say(siteConfig.social.github);
          say(siteConfig.social.linkedin);
          break;
        case "skins":
          SKIN_IDS.forEach((id) =>
            say(
              `${id === currentSkin() ? "*" : " "} ${id.padEnd(16)}${SKINS[id].blurb}`,
            ),
          );
          break;
        case "skin":
          if (isSkinId(arg)) {
            applySkin(arg);
            say(`skin → ${arg}`);
          } else fail(`unknown skin "${arg}" — try \`skins\``);
          break;
        case "play":
          audio.play();
          unlockEgg("winamp");
          say(`♫ ${audio.tracks[audio.state.trackIndex]?.title ?? "playing"}`);
          break;
        case "pause":
        case "stop":
          audio.pause();
          say("paused");
          break;
        case "next":
          audio.next();
          say("next track");
          break;
        case "prev":
          audio.prev();
          say("previous track");
          break;
        case "secrets": {
          const found = new Set(foundEggs());
          say(`${found.size} / ${EGGS.length} found`);
          EGGS.forEach((e) =>
            say(
              found.has(e.id)
                ? `[x] ${e.name}`
                : `[ ] ???  — hint: ${e.hint}`,
            ),
          );
          if (arg === "reset") {
            resetEggs();
            say("progress wiped.");
          }
          break;
        }
        case "sudo":
          unlockEgg("sudo");
          fail("phil is not in the sudoers file. This incident will be reported.");
          break;
        case "whoami":
          say("guest — but you found the shell, so, a curious one.");
          break;
        case "date":
          say(new Date().toString());
          break;
        case "clear":
          setLines([]);
          return;
        case "exit":
        case "quit":
          close();
          return;
        default:
          fail(`command not found: ${cmd} — try \`help\``);
      }
      setLines((l) => [...l, ...out].slice(-200));
    },
    [audio, close, projects, router],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[70] px-2 pb-2 sm:px-4 sm:pb-4"
      role="dialog"
      aria-label="Site terminal"
    >
      <div
        className="mx-auto flex h-[46vh] max-h-[420px] w-full max-w-3xl flex-col border border-accent bg-black/95 shadow-2xl"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center justify-between border-b border-white/20 px-3 py-1.5 font-pixel text-[9px] text-accent">
          <span>phil.sh</span>
          <button
            type="button"
            onClick={close}
            aria-label="Close terminal"
            className="px-1 text-white/70 hover:text-white"
          >
            ×
          </button>
        </div>
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-3 py-2 font-terminal text-sm leading-relaxed"
          aria-live="polite"
        >
          {lines.map((l, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap break-words ${
                l.kind === "err"
                  ? "text-accent-alt"
                  : l.kind === "in"
                    ? "text-white"
                    : "text-white/75"
              }`}
            >
              {l.kind === "in" ? `$ ${l.text}` : l.text}
            </div>
          ))}
        </div>
        <form
          className="flex items-center gap-2 border-t border-white/20 px-3 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (value.trim()) setHistory((h) => [value, ...h].slice(0, 50));
            historyIndex.current = -1;
            run(value);
            setValue("");
          }}
        >
          <span aria-hidden="true" className="font-terminal text-sm text-accent">
            $
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/`/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") {
                e.preventDefault();
                const n = Math.min(historyIndex.current + 1, history.length - 1);
                if (n >= 0) {
                  historyIndex.current = n;
                  setValue(history[n]);
                }
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const n = historyIndex.current - 1;
                historyIndex.current = Math.max(n, -1);
                setValue(n >= 0 ? history[n] : "");
              }
            }}
            aria-label="Terminal input"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent font-terminal text-base text-white outline-none sm:text-sm"
          />
        </form>
      </div>
    </div>
  );
}
