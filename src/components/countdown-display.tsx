"use client";

import { useEffect, useState } from "react";
import type { CountdownWithStyle } from "@/lib/types";
import { fontMap } from "@/lib/fonts";

interface CountdownDisplayProps {
  countdown: CountdownWithStyle;
  minimal?: boolean;
}

function calculateTimeLeft(targetDate: Date) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

export function CountdownDisplay({ countdown, minimal = false }: CountdownDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(countdown.targetDate));
  const style = countdown.style;

  const bgColor = style?.backgroundColor ?? "#ffffff";
  const txtColor = style?.textColor ?? "#000000";
  const accent = style?.accentColor ?? "#3b82f6";
  const fontName = style?.fontFamily ?? "Inter";
  const font = fontMap[fontName] ?? fontName;
  const bgImage = style?.backgroundImageUrl;
  const format = style?.displayFormat ?? "DHMS";
  const customCss = style?.customCss;

  useEffect(() => {
    if (countdown.status === "PAUSED") return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(countdown.targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown.targetDate, countdown.status]);

  const isPaused = countdown.status === "PAUSED";
  const isCompleted = countdown.status === "COMPLETED" || timeLeft.done;

  return (
    <>
      {customCss && (
        <style dangerouslySetInnerHTML={{ __html: customCss }} />
      )}
      <div
        className="countdown-container flex min-h-screen flex-col items-center justify-center p-8"
        style={{
          backgroundColor: bgColor,
          color: txtColor,
          fontFamily: font,
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: minimal ? "100vh" : undefined,
        }}
      >
        {!minimal && (
          <h1
            className="mb-2 text-center text-3xl font-bold sm:text-4xl md:text-5xl"
            style={{ color: txtColor }}
          >
            {countdown.title}
          </h1>
        )}
        {!minimal && countdown.description && (
          <p className="mb-8 text-center text-lg opacity-80" style={{ color: txtColor }}>
            {countdown.description}
          </p>
        )}
        {minimal && (
          <h2 className="mb-4 text-center text-xl font-bold" style={{ color: txtColor }}>
            {countdown.title}
          </h2>
        )}

        {isCompleted ? (
          <div className="text-center">
            <p className="text-3xl font-bold sm:text-5xl" style={{ color: accent }}>
              Time&apos;s Up!
            </p>
          </div>
        ) : isPaused ? (
          <div className="text-center">
            <p className="text-2xl font-semibold opacity-60" style={{ color: txtColor }}>
              Countdown Paused
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-6">
            {format === "FULL" ? (
              <p
                className="text-2xl font-bold sm:text-4xl"
                style={{ color: accent }}
              >
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </p>
            ) : (
              <>
                {format === "DHMS" && (
                  <>
                    <TimeUnit value={timeLeft.days} label="Days" accent={accent} />
                    <Colon accent={accent} />
                  </>
                )}
                <TimeUnit
                  value={format === "HMS" ? timeLeft.hours + timeLeft.days * 24 : timeLeft.hours}
                  label="Hours"
                  accent={accent}
                />
                <Colon accent={accent} />
                <TimeUnit value={timeLeft.minutes} label="Minutes" accent={accent} />
                <Colon accent={accent} />
                <TimeUnit value={timeLeft.seconds} label="Seconds" accent={accent} />
              </>
            )}
          </div>
        )}

        {!minimal && (
          <p className="mt-8 text-sm opacity-50" style={{ color: txtColor }}>
            {new Date(countdown.targetDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </>
  );
}

function TimeUnit({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="text-4xl font-bold tabular-nums sm:text-6xl md:text-7xl"
        style={{ color: accent }}
      >
        {value.toString().padStart(2, "0")}
      </span>
      <span className="mt-1 text-xs uppercase tracking-widest opacity-60 sm:text-sm">
        {label}
      </span>
    </div>
  );
}

function Colon({ accent }: { accent: string }) {
  return (
    <span
      className="mb-4 text-3xl font-bold sm:text-5xl md:text-6xl"
      style={{ color: accent, opacity: 0.4 }}
    >
      :
    </span>
  );
}
