"use client";

const MESSAGE =
  "★彡 WELCOME ★彡 ENTER THE V O I D ★彡 BEST VIEWED IN NETSCAPE NAVIGATOR ★彡 ｱ ｴ s ｲ ﾄ ｴ ﾄ ｲ ｸ ★彡 PHIL CHERNER DOT COM ★彡 ";

export default function VaporMarquee() {
  const repeated = MESSAGE.repeat(3);
  return (
    <div
      aria-hidden="true"
      className="fixed top-0 inset-x-0 z-[55] overflow-hidden select-none"
      style={{
        background:
          "linear-gradient(90deg, #ff00aa 0%, #00ffff 50%, #ff00aa 100%)",
        borderBottom: "2px solid #00ffff",
        boxShadow: "0 0 20px rgba(0,255,255,0.7)",
        padding: "6px 0",
      }}
    >
      <div
        className="whitespace-nowrap text-sm"
        style={{
          color: "#1a002a",
          fontFamily: "var(--font-retro), 'Audiowide', sans-serif",
          letterSpacing: "0.08em",
          textShadow: "0 0 6px rgba(255,255,255,0.9)",
          animation: "skin-marquee 35s linear infinite",
          display: "inline-block",
          paddingLeft: "100%",
        }}
      >
        {repeated}
      </div>
    </div>
  );
}
