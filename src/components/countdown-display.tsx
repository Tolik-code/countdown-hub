"use client";

import { useEffect, useState } from "react";
import type { CountdownWithStyle } from "@/lib/types";
import { fontMap } from "@/lib/fonts";
import { FallingAnimation } from "@/components/falling-animation";

interface CountdownDisplayProps {
  countdown: CountdownWithStyle;
  minimal?: boolean;
}

const FONT_SIZE_MAP: Record<string, { number: string; label: string; title: string; full: string }> = {
  sm: { number: "text-2xl sm:text-3xl", label: "text-[10px] sm:text-xs", title: "text-xl sm:text-2xl", full: "text-xl sm:text-2xl" },
  md: { number: "text-4xl sm:text-6xl md:text-7xl", label: "text-xs sm:text-sm", title: "text-3xl sm:text-4xl md:text-5xl", full: "text-2xl sm:text-4xl" },
  lg: { number: "text-5xl sm:text-7xl md:text-8xl", label: "text-sm sm:text-base", title: "text-4xl sm:text-5xl md:text-6xl", full: "text-3xl sm:text-5xl" },
  xl: { number: "text-6xl sm:text-8xl md:text-9xl", label: "text-base sm:text-lg", title: "text-5xl sm:text-6xl md:text-7xl", full: "text-4xl sm:text-6xl" },
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
  const fSize = style?.fontSize ?? "md";
  const fWeight = style?.fontWeight ?? "bold";
  const tBorder = style?.textBorder ?? "none";
  const tShadow = style?.textShadow ?? "none";
  const compTitle = style?.completionTitle ?? "Time's Up!";
  const compBg = style?.completionBgColor ?? "#000000";
  const compText = style?.completionTextColor ?? "#ffffff";
  const anim = style?.animation ?? "none";
  const animImg = style?.animationImageUrl;

  const sizes = FONT_SIZE_MAP[fSize] || FONT_SIZE_MAP.md;
  const fontWeightValue = fWeight === "normal" ? 400 : fWeight === "bold" ? 700 : fWeight === "black" ? 900 : 300;

  const combinedShadow = [
    TEXT_SHADOW_MAP[tShadow] !== "none" ? TEXT_SHADOW_MAP[tShadow] : "",
    TEXT_BORDER_MAP[tBorder] !== "none" ? TEXT_BORDER_MAP[tBorder] : "",
  ]
    .filter(Boolean)
    .join(", ") || "none";

  useEffect(() => {
    if (countdown.status === "PAUSED") return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(countdown.targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown.targetDate, countdown.status]);

  const isPaused = countdown.status === "PAUSED";
  const isCompleted = countdown.status === "COMPLETED" || timeLeft.done;

  if (isCompleted) {
    return (
      <>
        {customCss && <style dangerouslySetInnerHTML={{ __html: customCss }} />}
        <div
          className="countdown-container relative flex min-h-screen flex-col items-center justify-center p-8 overflow-hidden"
          style={{
            backgroundColor: compBg,
            color: compText,
            fontFamily: font,
          }}
        >
          {anim !== "none" && <FallingAnimation animation={anim} imageUrl={animImg ?? undefined} />}
          {!minimal && (
            <h1
              className={`mb-6 text-center ${sizes.title} relative z-10`}
              style={{ color: compText, textShadow: combinedShadow, fontWeight: fontWeightValue }}
            >
              {countdown.title}
            </h1>
          )}
          <p
            className={`text-center ${sizes.full} font-bold relative z-10`}
            style={{ color: compText, textShadow: combinedShadow }}
          >
            {compTitle}
          </p>

          {!minimal && <CountdownFooter txtColor={compText} />}
        </div>
      </>
    );
  }

  return (
    <>
      {customCss && (
        <style dangerouslySetInnerHTML={{ __html: customCss }} />
      )}
      <div
        className="countdown-container relative flex min-h-screen flex-col items-center justify-center p-8 overflow-hidden"
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
        {anim !== "none" && <FallingAnimation animation={anim} imageUrl={animImg ?? undefined} />}

        {!minimal && (
          <h1
            className={`mb-2 text-center ${sizes.title} relative z-10`}
            style={{ color: txtColor, textShadow: combinedShadow, fontWeight: fontWeightValue }}
          >
            {countdown.title}
          </h1>
        )}
        {!minimal && countdown.description && (
          <p
            className="mb-8 text-center text-lg opacity-80 relative z-10"
            style={{ color: txtColor, textShadow: combinedShadow }}
          >
            {countdown.description}
          </p>
        )}
        {minimal && (
          <h2
            className="mb-4 text-center text-xl font-bold relative z-10"
            style={{ color: txtColor, textShadow: combinedShadow }}
          >
            {countdown.title}
          </h2>
        )}

        {isPaused ? (
          <div className="text-center relative z-10">
            <p className="text-2xl font-semibold opacity-60" style={{ color: txtColor }}>
              Countdown Paused
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-6 relative z-10">
            {format === "FULL" ? (
              <p
                className={`${sizes.full} font-bold`}
                style={{ color: accent, textShadow: combinedShadow, fontWeight: fontWeightValue }}
              >
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </p>
            ) : (
              <>
                {format === "DHMS" && (
                  <>
                    <TimeUnit value={timeLeft.days} label="Days" accent={accent} sizeNum={sizes.number} sizeLabel={sizes.label} shadow={combinedShadow} weight={fontWeightValue} />
                    <Colon accent={accent} sizeNum={sizes.number} />
                  </>
                )}
                <TimeUnit
                  value={format === "HMS" ? timeLeft.hours + timeLeft.days * 24 : timeLeft.hours}
                  label="Hours"
                  accent={accent}
                  sizeNum={sizes.number}
                  sizeLabel={sizes.label}
                  shadow={combinedShadow}
                  weight={fontWeightValue}
                />
                <Colon accent={accent} sizeNum={sizes.number} />
                <TimeUnit value={timeLeft.minutes} label="Minutes" accent={accent} sizeNum={sizes.number} sizeLabel={sizes.label} shadow={combinedShadow} weight={fontWeightValue} />
                <Colon accent={accent} sizeNum={sizes.number} />
                <TimeUnit value={timeLeft.seconds} label="Seconds" accent={accent} sizeNum={sizes.number} sizeLabel={sizes.label} shadow={combinedShadow} weight={fontWeightValue} />
              </>
            )}
          </div>
        )}

        {!minimal && (
          <p className="mt-8 text-sm opacity-50 relative z-10" style={{ color: txtColor, textShadow: combinedShadow, fontWeight: fontWeightValue }}>
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

        {!minimal && <CountdownFooter txtColor={txtColor} />}
      </div>
    </>
  );
}

function TimeUnit({
  value,
  label,
  accent,
  sizeNum,
  sizeLabel,
  shadow,
  weight,
}: {
  value: number;
  label: string;
  accent: string;
  sizeNum: string;
  sizeLabel: string;
  shadow: string;
  weight: number;
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={`${sizeNum} tabular-nums`}
        style={{ color: accent, textShadow: shadow, fontWeight: weight }}
      >
        {value.toString().padStart(2, "0")}
      </span>
      <span className={`mt-1 ${sizeLabel} uppercase tracking-widest opacity-60`} style={{ textShadow: shadow, fontWeight: weight }}>
        {label}
      </span>
    </div>
  );
}

function Colon({ accent, sizeNum }: { accent: string; sizeNum: string }) {
  return (
    <span
      className={`mb-4 ${sizeNum} font-bold`}
      style={{ color: accent, opacity: 0.4 }}
    >
      :
    </span>
  );
}

function CountdownFooter({ txtColor }: { txtColor: string }) {
  return (
    <footer className="absolute bottom-0 left-0 right-0 z-10 flex flex-wrap items-center justify-center gap-3 px-4 py-3 text-xs" style={{ color: txtColor, opacity: 0.5 }}>
      <a href="/" className="hover:opacity-100 transition-opacity">Create your own countdown</a>
      <span>·</span>
      <a href="/privacy" className="hover:opacity-100 transition-opacity">Privacy</a>
      <span>·</span>
      <a href="/terms" className="hover:opacity-100 transition-opacity">Terms</a>
    </footer>
  );
}
