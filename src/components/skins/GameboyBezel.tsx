"use client";

export default function GameboyBezel() {
  return (
    <div
      aria-hidden="true"
      className="hidden lg:block fixed inset-0 z-[45] pointer-events-none"
    >
      {/* Top bezel: "POWER" indicator + Nintendo wordmark */}
      <div
        className="absolute top-0 inset-x-0 flex items-center justify-between px-8 py-2 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #c4d6a0 0%, #aac76a 100%)",
          borderBottom: "3px solid #0f380f",
          fontFamily: "var(--font-pixel), 'Press Start 2P', monospace",
          color: "#0f380f",
          fontSize: 9,
          letterSpacing: "0.1em",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              background: "#d33",
              boxShadow: "0 0 6px #f55",
            }}
          />
          <span>POWER</span>
        </div>
        <div>NINTENDO® GAME BOY™ — PHIL.CHERNER</div>
        <div>DOT MATRIX WITH STEREO SOUND</div>
      </div>

      {/* Bottom bezel: D-pad + A/B buttons + start/select */}
      <div
        className="absolute bottom-0 inset-x-0 px-12 py-4 flex items-center justify-between pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, #c4d6a0 0%, #aac76a 100%)",
          borderTop: "3px solid #0f380f",
        }}
      >
        {/* D-pad */}
        <div className="relative w-16 h-16">
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 w-5 h-16"
            style={{ background: "#0f380f" }}
          />
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 w-16 h-5"
            style={{ background: "#0f380f" }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3"
            style={{ background: "#306230", borderRadius: 2 }}
          />
        </div>

        {/* SELECT / START */}
        <div
          className="flex items-center gap-4"
          style={{
            fontFamily: "var(--font-pixel), 'Press Start 2P', monospace",
            color: "#0f380f",
            fontSize: 8,
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <span
              className="block w-9 h-2 rounded-full"
              style={{ background: "#0f380f", transform: "skewX(-25deg)" }}
            />
            <span>SELECT</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span
              className="block w-9 h-2 rounded-full"
              style={{ background: "#0f380f", transform: "skewX(-25deg)" }}
            />
            <span>START</span>
          </div>
        </div>

        {/* A / B */}
        <div
          className="flex items-center gap-4 -rotate-[18deg]"
          style={{
            fontFamily: "var(--font-pixel), 'Press Start 2P', monospace",
            color: "#0f380f",
            fontSize: 10,
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, #a66 0%, #642 60%, #311 100%)",
                color: "#fee",
                boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.4)",
              }}
            >
              B
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 35%, #a66 0%, #642 60%, #311 100%)",
                color: "#fee",
                boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.4)",
              }}
            >
              A
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
