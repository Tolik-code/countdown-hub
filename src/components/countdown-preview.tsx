"use client";

import { useEffect, useState } from "react";
import { fontMap } from "@/lib/fonts";

interface CountdownPreviewProps {
  title: string;
  targetDate: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  backgroundImageUrl?: string;
  displayFormat: string;
  customCss?: string;
}

function calculateTimeLeft(targetDate: string) {
  if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const time = new Date(targetDate).getTime();
  if (isNaN(time)) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const diff = time - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownPreview({
  title,
  targetDate,
  backgroundColor,
  textColor,
  accentColor,
  fontFamily,
  backgroundImageUrl,
  displayFormat,
}: CountdownPreviewProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const renderTime = () => {
    switch (displayFormat) {
      case "HMS":
        return (
          <>
            <TimeBlock value={timeLeft.hours + timeLeft.days * 24} label="Hours" accentColor={accentColor} />
            <Separator accentColor={accentColor} />
            <TimeBlock value={timeLeft.minutes} label="Minutes" accentColor={accentColor} />
            <Separator accentColor={accentColor} />
            <TimeBlock value={timeLeft.seconds} label="Seconds" accentColor={accentColor} />
          </>
        );
      case "FULL":
        return (
          <p style={{ color: accentColor }} className="text-xl font-semibold">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </p>
        );
      default:
        return (
          <>
            <TimeBlock value={timeLeft.days} label="Days" accentColor={accentColor} />
            <Separator accentColor={accentColor} />
            <TimeBlock value={timeLeft.hours} label="Hours" accentColor={accentColor} />
            <Separator accentColor={accentColor} />
            <TimeBlock value={timeLeft.minutes} label="Min" accentColor={accentColor} />
            <Separator accentColor={accentColor} />
            <TimeBlock value={timeLeft.seconds} label="Sec" accentColor={accentColor} />
          </>
        );
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg p-8"
      style={{
        backgroundColor,
        color: textColor,
        fontFamily: fontMap[fontFamily] ?? fontFamily,
        backgroundImage: backgroundImageUrl
          ? `url(${backgroundImageUrl})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: 200,
      }}
    >
      <h2 className="mb-4 text-xl font-bold" style={{ color: textColor }}>
        {title || "Your Countdown"}
      </h2>
      <div className="flex items-center gap-3">{renderTime()}</div>
    </div>
  );
}

function TimeBlock({
  value,
  label,
  accentColor,
}: {
  value: number;
  label: string;
  accentColor: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="text-3xl font-bold tabular-nums"
        style={{ color: accentColor }}
      >
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-xs uppercase opacity-70">{label}</span>
    </div>
  );
}

function Separator({ accentColor }: { accentColor: string }) {
  return (
    <span
      className="text-2xl font-bold"
      style={{ color: accentColor, opacity: 0.5 }}
    >
      :
    </span>
  );
}
