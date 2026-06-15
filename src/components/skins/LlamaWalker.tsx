"use client";

export default function LlamaWalker() {
  return (
    <div
      aria-hidden="true"
      className="fixed bottom-2 left-0 right-0 pointer-events-none z-[44] overflow-hidden"
      style={{ height: 64 }}
    >
      <style>{`
        @keyframes llama-walk {
          0%   { transform: translateX(-10vw); }
          100% { transform: translateX(110vw); }
        }
        @keyframes llama-bounce {
          0%, 100% { transform: translateY(0)   rotate(-2deg); }
          50%      { transform: translateY(-4px) rotate(2deg); }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          animation: "llama-walk 22s linear infinite",
        }}
      >
        <div
          style={{
            fontSize: 42,
            transformOrigin: "bottom",
            animation: "llama-bounce 0.45s ease-in-out infinite",
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))",
          }}
        >
          🦙
        </div>
      </div>
    </div>
  );
}
