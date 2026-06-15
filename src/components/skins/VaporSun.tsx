"use client";

type Props = { inline?: boolean };

export default function VaporSun({ inline = false }: Props) {
  const wrapperClass = inline
    ? "relative w-full aspect-square overflow-hidden"
    : "skin-bg-canvas overflow-hidden";

  return (
    <div aria-hidden="true" className={wrapperClass}>
      <div
        className="absolute left-1/2 top-[28%] -translate-x-1/2"
        style={{
          width: inline ? "85%" : "min(60vmin, 520px)",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 35%, #ffe8a3 0%, #ffb547 35%, #ff5fa0 75%, transparent 80%)",
          filter: "blur(2px)",
          opacity: 0.85,
        }}
      />
      <div
        className="absolute left-1/2 top-[40%] -translate-x-1/2 mix-blend-multiply"
        style={{
          width: inline ? "85%" : "min(60vmin, 520px)",
          height: inline ? "60%" : "min(40vmin, 360px)",
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0 6px, transparent 6px 22px)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: inline ? "55%" : "55vh",
          backgroundImage:
            "linear-gradient(to right, rgba(0,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "30px 22px",
          transform: "perspective(380px) rotateX(60deg)",
          transformOrigin: "bottom",
          opacity: 0.7,
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 25%, black 100%)",
        }}
      />
    </div>
  );
}
