import { ImageResponse } from "next/og";
import { getCountdownBySlug } from "@/lib/actions";

export const runtime = "edge";
export const alt = "Countdown Timer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface OGImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OGImage({ params }: OGImageProps) {
  const { slug } = await params;
  const countdown = await getCountdownBySlug(slug);

  if (!countdown) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#111",
            color: "#fff",
            fontSize: 48,
          }}
        >
          Countdown Not Found
        </div>
      ),
      { ...size }
    );
  }

  const bgColor = countdown.style?.backgroundColor ?? "#ffffff";
  const txtColor = countdown.style?.textColor ?? "#000000";
  const accent = countdown.style?.accentColor ?? "#3b82f6";

  const diff = new Date(countdown.targetDate).getTime() - Date.now();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
  const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
  const isComplete = diff <= 0;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: bgColor,
          color: txtColor,
          padding: 60,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            marginBottom: 20,
            textAlign: "center",
            maxWidth: "90%",
          }}
        >
          {countdown.title}
        </div>
        {countdown.description && (
          <div
            style={{
              fontSize: 24,
              opacity: 0.7,
              marginBottom: 40,
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            {countdown.description}
          </div>
        )}
        {isComplete ? (
          <div style={{ fontSize: 64, fontWeight: 700, color: accent }}>
            Complete!
          </div>
        ) : (
          <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 80, fontWeight: 700, color: accent }}>
                {days.toString().padStart(2, "0")}
              </div>
              <div style={{ fontSize: 18, opacity: 0.6, textTransform: "uppercase", letterSpacing: 2 }}>
                Days
              </div>
            </div>
            <div style={{ fontSize: 60, color: accent, opacity: 0.4 }}>:</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 80, fontWeight: 700, color: accent }}>
                {hours.toString().padStart(2, "0")}
              </div>
              <div style={{ fontSize: 18, opacity: 0.6, textTransform: "uppercase", letterSpacing: 2 }}>
                Hours
              </div>
            </div>
            <div style={{ fontSize: 60, color: accent, opacity: 0.4 }}>:</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 80, fontWeight: 700, color: accent }}>
                {minutes.toString().padStart(2, "0")}
              </div>
              <div style={{ fontSize: 18, opacity: 0.6, textTransform: "uppercase", letterSpacing: 2 }}>
                Min
              </div>
            </div>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            fontSize: 20,
            opacity: 0.4,
          }}
        >
          CountdownHub
        </div>
      </div>
    ),
    { ...size }
  );
}
