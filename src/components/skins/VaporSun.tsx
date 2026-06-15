"use client";

export default function VaporSun() {
  return (
    <div aria-hidden="true" className="skin-bg-canvas overflow-hidden">
      {/* Sun */}
      <div
        className="absolute left-1/2 top-[28%] -translate-x-1/2"
        style={{
          width: "min(60vmin, 520px)",
          height: "min(60vmin, 520px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 35%, #ffe8a3 0%, #ffb547 35%, #ff5fa0 75%, transparent 80%)",
          filter: "blur(2px)",
          opacity: 0.7,
        }}
      />
      {/* Horizontal sun bands */}
      <div
        className="absolute left-1/2 top-[40%] -translate-x-1/2 mix-blend-multiply"
        style={{
          width: "min(60vmin, 520px)",
          height: "min(40vmin, 360px)",
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.45) 0 6px, transparent 6px 24px)",
        }}
      />
      {/* Grid floor */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "55vh",
          backgroundImage:
            "linear-gradient(to right, rgba(0,255,255,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "40px 28px",
          transform: "perspective(420px) rotateX(60deg)",
          transformOrigin: "bottom",
          opacity: 0.55,
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 25%, black 100%)",
        }}
      />
    </div>
  );
}
