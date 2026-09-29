import { ImageResponse } from "next/og";

// Supplies the 180×180 touch icon iOS uses when a visitor adds the site to
// their home screen. Without it, Safari screenshots the page instead.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#00fff9",
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: 2,
          fontFamily: "ui-monospace, monospace",
        }}
      >
        PC
      </div>
    ),
    size,
  );
}
