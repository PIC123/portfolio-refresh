import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = `${siteConfig.name} — Creative Technologist`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(circle at 30% 20%, #0d2a2a 0%, #050505 60%)",
          color: "#ededed",
          fontFamily: "ui-monospace, monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#00fff9",
            fontSize: 28,
            letterSpacing: 4,
          }}
        >
          PC ◇ {siteConfig.location.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: -2,
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: 36,
              lineHeight: 1.25,
              color: "#ededed",
              maxWidth: 1000,
            }}
          >
            Creative technologist · researcher · storyteller at the intersection
            of art, design &amp; AI.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#00fff9",
            fontSize: 24,
          }}
        >
          <span>MIT MEDIA LAB</span>
          <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    ),
    size,
  );
}
