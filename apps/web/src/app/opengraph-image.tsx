import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "StayWise - Find Your Perfect Stay";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: "bold",
              letterSpacing: "-0.05em",
            }}
          >
            🏠 StayWise
          </div>
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: "normal",
            textAlign: "center",
            maxWidth: "80%",
            lineHeight: 1.4,
            opacity: 0.9,
          }}
        >
          Your Perfect Stay Awaits
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: "normal",
            marginTop: 30,
            opacity: 0.8,
          }}
        >
          Discover • Book • Enjoy
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
