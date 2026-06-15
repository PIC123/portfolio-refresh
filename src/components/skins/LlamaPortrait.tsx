"use client";

const LLAMA_ASCII = String.raw`
            ___,
          //_,;\
        _//_,;\\
      _//,;\\\
    _//,;\\\\\
  _//;'\\\\\\\\
 _||___\\\\\\\
 |  o  |\\\\\\\
 |\___/||||||||
 |     ||______|
 |     ||  |  |
 \____/||  |  |
   __||||  |  |
  |    |‾‾~~~~
`;

export default function LlamaPortrait() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full skin-surface flex items-center justify-center overflow-hidden"
      style={{
        aspectRatio: "1 / 1",
        background: "rgba(255,232,176,0.04)",
        padding: 12,
      }}
    >
      <pre
        className="text-[11px] leading-[1.15] select-none"
        style={{
          color: "var(--accent)",
          fontFamily:
            "var(--font-terminal), 'Share Tech Mono', ui-monospace, monospace",
          textShadow: "0 0 8px rgba(255,140,26,0.4)",
        }}
      >
        {LLAMA_ASCII}
      </pre>
      <span
        className="absolute bottom-3 right-3"
        style={{
          fontFamily: "var(--font-script), 'Pacifico', cursive",
          color: "var(--muted)",
          fontSize: 16,
        }}
      >
        whip it good
      </span>
    </div>
  );
}
