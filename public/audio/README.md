# Audio

Drop real music files here (e.g. `my-track.mp3`) and register them in
`src/lib/audio/tracks.ts` as a `kind: "file"` track to have the Winamp skin
play them. They route through the same Web Audio graph as the synthesized
tracks, so the spectrum visualizer and graphic EQ work on them too.

If no files are present, the Winamp skin falls back to live-synthesized
tracks — so this folder can stay empty.
