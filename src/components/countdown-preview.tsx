"use client";

import { useEffect, useState } from "react";
import { fontMap } from "@/lib/fonts";
import { FallingAnimation } from "@/components/falling-animation";

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
  fontSize?: string;
  fontWeight?: string;
  textBorder?: string;
  textShadow?: string;
  completionTitle?: string;
  completionBgColor?: string;
  completionTextColor?: string;
  animation?: string;
  animationImageUrl?: string;
}

const FONT_SIZE_MAP: Record<string, string> = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl",
  xl: "text-7xl",
};

const FONT_SIZE_TITLE_MAP: Record<string, string> = {
  sm: "text-sm",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
};

const TEXT_SHADOW_MAP: Record<string, string> = {
  none: "none",
  sm: "1px 1px 2px rgba(0,0,0,0.5)",
  md: "2px 2px 4px rgba(0,0,0,0.5)",
  lg: "3px 3px 6px rgba(0,0,0,0.7)",
  glow: "0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)",
};

const TEXT_BORDER_MAP: Record<string, string> = {
  none: "none",
  thin: "-1px -1px 0 rgba(0,0,0,0.5), 1px -1px 0 rgba(0,0,0,0.5), -1px 1px 0 rgba(0,0,0,0.5), 1px 1px 0 rgba(0,0,0,0.5)",
  thick: "-2px -2px 0 rgba(0,0,0,0.7), 2px -2px 0 rgba(0,0,0,0.7), -2px 2px 0 rgba(0,0,0,0.7), 2px 2px 0 rgba(0,0,0,0.7)",
  white: "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff",
};

function calculateTimeLeft(targetDate: string) {
  if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: false };
  const time = new Date(targetDate).getTime();
  if (isNaN(time)) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: false };
  const diff = time - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
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
  fontSize = "md",
  fontWeight = "bold",
  textBorder = "none",
  textShadow = "none",
  completionTitle = "Time's Up!",
  completionBgColor = "#000000",
  completionTextColor = "#ffffff",
  animation = "none",
  animationImageUrl,
}: CountdownPreviewProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const isCompleted = timeLeft.done;

  const textStyle = {
    textShadow: TEXT_SHADOW_MAP[textShadow] || "none",
    WebkitTextStroke: TEXT_BORDER_MAP[textBorder] !== "none" ? undefined : undefined,
  };

  const textStrokeShadow = TEXT_BORDER_MAP[textBorder] || "none";
  const combinedShadow = [
    TEXT_SHADOW_MAP[textShadow] !== "none" ? TEXT_SHADOW_MAP[textShadow] : "",
    textStrokeShadow !== "none" ? textStrokeShadow : "",
  ]
    .filter(Boolean)
    .join(", ") || "none";

  const fontWeightValue = fontWeight === "normal" ? 400 : fontWeight === "bold" ? 700 : fontWeight === "black" ? 900 : 300;

  if (isCompleted) {
    return (
      <div
        className="relative flex flex-col items-center justify-center rounded-lg p-8 overflow-hidden"
        style={{
          backgroundColor: completionBgColor,
          color: completionTextColor,
          fontFamily: fontMap[fontFamily] ?? fontFamily,
          minHeight: 300,
        }}
      >
        {animation !== "none" && (
          <FallingAnimation animation={animation} imageUrl={animationImageUrl} />
        )}
        <p className="text-2xl font-bold relative z-10" style={{ color: completionTextColor, textShadow: combinedShadow }}>
          {completionTitle}
        </p>
      </div>
    );
  }

  const renderTime = () => {
    const sizeClass = FONT_SIZE_MAP[fontSize] || "text-3xl";
    const style = { color: accentColor, textShadow: combinedShadow, fontWeight: fontWeightValue };

    switch (displayFormat) {
      case "HMS":
        return (
          <>
            <TimeBlock value={timeLeft.hours + timeLeft.days * 24} label="Hours" sizeClass={sizeClass} style={style} />
            <Separator accentColor={accentColor} />
            <TimeBlock value={timeLeft.minutes} label="Minutes" sizeClass={sizeClass} style={style} />
            <Separator accentColor={accentColor} />
            <TimeBlock value={timeLeft.seconds} label="Seconds" sizeClass={sizeClass} style={style} />
          </>
        );
      case "FULL":
        return (
          <p className={`${sizeClass} font-semibold`} style={style}>
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </p>
        );
      default:
        return (
          <>
            <TimeBlock value={timeLeft.days} label="Days" sizeClass={sizeClass} style={style} />
            <Separator accentColor={accentColor} />
            <TimeBlock value={timeLeft.hours} label="Hours" sizeClass={sizeClass} style={style} />
            <Separator accentColor={accentColor} />
            <TimeBlock value={timeLeft.minutes} label="Min" sizeClass={sizeClass} style={style} />
            <Separator accentColor={accentColor} />
            <TimeBlock value={timeLeft.seconds} label="Sec" sizeClass={sizeClass} style={style} />
          </>
        );
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center rounded-lg p-8 overflow-hidden"
      style={{
        backgroundColor,
        color: textColor,
        fontFamily: fontMap[fontFamily] ?? fontFamily,
        backgroundImage: backgroundImageUrl
          ? `url(${backgroundImageUrl})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: 300,
      }}
    >
      {animation !== "none" && (
        <FallingAnimation animation={animation} imageUrl={animationImageUrl} />
      )}
      <h2
        className={`mb-4 ${FONT_SIZE_TITLE_MAP[fontSize] || "text-xl"} relative z-10`}
        style={{
          color: textColor,
          textShadow: combinedShadow,
          fontWeight: fontWeightValue,
        }}
      >
        {title || "Your Countdown"}
      </h2>
      <div className="flex items-center gap-3 relative z-10">{renderTime()}</div>
    </div>
  );
}

function TimeBlock({
  value,
  label,
  sizeClass,
  style,
}: {
  value: number;
  label: string;
  sizeClass: string;
  style: React.CSSProperties;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className={`${sizeClass} tabular-nums`} style={style}>
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
