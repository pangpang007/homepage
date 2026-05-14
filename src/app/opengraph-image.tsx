import { ImageResponse } from "next/og";

export const alt = "Liu Yan — Frontend Engineer, Web3, React / Next.js";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0f0f23 0%, #312e81 42%, #0f0f23 100%)",
          padding: 72,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#f8fafc",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Liu Yan
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 34,
            fontWeight: 600,
            color: "#a78bfa",
            maxWidth: 900,
            lineHeight: 1.25,
          }}
        >
          Frontend Engineer · Web3 · React / Next.js
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            color: "#94a3b8",
          }}
        >
          Beijing · 11+ years experience
        </div>
        <div
          style={{
            marginTop: 36,
            height: 4,
            width: 120,
            borderRadius: 4,
            background: "linear-gradient(90deg, #fbbf24, #8b5cf6)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
