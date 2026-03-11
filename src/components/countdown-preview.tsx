"use client";

import { useEffect, useState, useRef } from "react";
import { fontMap } from "@/lib/fonts";
import { FallingAnimation } from "@/components/falling-animation";
import { useTranslation } from "@/lib/i18n/locale-context";
import { DATE_LOCALE_MAP } from "@/lib/i18n";

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
  cardStyle?: string;
  animation?: string;
  animationImageUrl?: string;
  actionButtonText?: string;
  actionButtonUrl?: string;
  actionButtonBgColor?: string;
  actionButtonTextColor?: string;
  actionButtonRadius?: string;
  actionButtonHoverColor?: string;
}

const ACTION_RADIUS_MAP: Record<string, string> = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  full: "9999px",
};

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
  cardStyle = "none",
  animation = "none",
  animationImageUrl,
  actionButtonText,
  actionButtonUrl,
  actionButtonBgColor = "#3b82f6",
  actionButtonTextColor = "#ffffff",
  actionButtonRadius = "md",
  actionButtonHoverColor,
}: CountdownPreviewProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
  const { t, locale } = useTranslation();

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const isCompleted = timeLeft.done;

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
        className="relative flex flex-col items-center justify-center rounded-lg p-4 sm:p-8 overflow-hidden"
        style={{
          backgroundColor: completionBgColor,
          color: completionTextColor,
          fontFamily: fontMap[fontFamily] ?? fontFamily,
          minHeight: 250,
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
    const Block = cardStyle === "flip" ? FlipTimeBlock : TimeBlock;

    switch (displayFormat) {
      case "HMS":
        return (
          <>
            <Block value={timeLeft.hours + timeLeft.days * 24} label={t("countdown.hours")} sizeClass={sizeClass} style={style} cardStyle={cardStyle} accentColor={accentColor} />
            <Separator accentColor={accentColor} cardStyle={cardStyle} />
            <Block value={timeLeft.minutes} label={t("countdown.minutes")} sizeClass={sizeClass} style={style} cardStyle={cardStyle} accentColor={accentColor} />
            <Separator accentColor={accentColor} cardStyle={cardStyle} />
            <Block value={timeLeft.seconds} label={t("countdown.seconds")} sizeClass={sizeClass} style={style} cardStyle={cardStyle} accentColor={accentColor} />
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
            <Block value={timeLeft.days} label={t("countdown.days")} sizeClass={sizeClass} style={style} cardStyle={cardStyle} accentColor={accentColor} />
            <Separator accentColor={accentColor} cardStyle={cardStyle} />
            <Block value={timeLeft.hours} label={t("countdown.hours")} sizeClass={sizeClass} style={style} cardStyle={cardStyle} accentColor={accentColor} />
            <Separator accentColor={accentColor} cardStyle={cardStyle} />
            <Block value={timeLeft.minutes} label={t("countdown.min")} sizeClass={sizeClass} style={style} cardStyle={cardStyle} accentColor={accentColor} />
            <Separator accentColor={accentColor} cardStyle={cardStyle} />
            <Block value={timeLeft.seconds} label={t("countdown.sec")} sizeClass={sizeClass} style={style} cardStyle={cardStyle} accentColor={accentColor} />
          </>
        );
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center rounded-lg p-4 sm:p-8 overflow-hidden w-full max-w-full"
      style={{
        backgroundColor,
        color: textColor,
        fontFamily: fontMap[fontFamily] ?? fontFamily,
        backgroundImage: backgroundImageUrl
          ? `url(${backgroundImageUrl})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: 250,
        wordBreak: "break-word",
      }}
    >
      {animation !== "none" && (
        <FallingAnimation animation={animation} imageUrl={animationImageUrl} />
      )}
      <h2
        className={`mb-3 sm:mb-4 ${FONT_SIZE_TITLE_MAP[fontSize] || "text-xl"} text-center relative z-10`}
        style={{
          color: textColor,
          textShadow: combinedShadow,
          fontWeight: fontWeightValue,
        }}
      >
        {title || t("countdown.yourCountdown")}
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 relative z-10">{renderTime()}</div>
      {actionButtonText && actionButtonUrl && (
        <a
          href={actionButtonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block px-6 py-2 text-sm font-medium transition-colors relative z-10"
          style={{
            backgroundColor: actionButtonBgColor,
            color: actionButtonTextColor,
            borderRadius: ACTION_RADIUS_MAP[actionButtonRadius] ?? "0.5rem",
          }}
          onMouseEnter={(e) =>
            actionButtonHoverColor &&
            (e.currentTarget.style.backgroundColor = actionButtonHoverColor)
          }
          onMouseLeave={(e) =>
            actionButtonHoverColor &&
            (e.currentTarget.style.backgroundColor = actionButtonBgColor)
          }
        >
          {actionButtonText}
        </a>
      )}
      {targetDate && (
        <p
          className="mt-3 sm:mt-4 text-[10px] sm:text-xs opacity-50 relative z-10 text-center"
          style={{ color: textColor, textShadow: combinedShadow, fontWeight: fontWeightValue }}
        >
          {new Date(targetDate).toLocaleDateString(DATE_LOCALE_MAP[locale], {
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
  );
}

function getCardWrapperStyles(cardStyle: string, accent: string): { className: string; style: React.CSSProperties } {
  switch (cardStyle) {
    case "cards":
      return { className: "rounded-lg px-3 py-2 sm:px-5 sm:py-3", style: { backgroundColor: `${accent}1a` } };
    case "glass":
      return { className: "rounded-lg px-3 py-2 sm:px-5 sm:py-3 backdrop-blur-md border border-white/20", style: { backgroundColor: "rgba(255,255,255,0.1)" } };
    case "neon":
      return { className: "rounded-lg px-3 py-2 sm:px-5 sm:py-3", style: { backgroundColor: "rgba(0,0,0,0.3)", boxShadow: `0 0 10px ${accent}80, 0 0 20px ${accent}40, inset 0 0 10px ${accent}20`, border: `1px solid ${accent}60` } };
    case "minimal":
      return { className: "rounded-md px-3 py-2 sm:px-5 sm:py-3", style: { border: `1px solid ${accent}40` } };
    case "flip":
      return { className: "rounded-md overflow-hidden", style: { backgroundColor: `${accent}1a` } };
    default:
      return { className: "", style: {} };
  }
}

function TimeBlock({
  value,
  label,
  sizeClass,
  style,
  cardStyle = "none",
  accentColor = "#3b82f6",
}: {
  value: number;
  label: string;
  sizeClass: string;
  style: React.CSSProperties;
  cardStyle?: string;
  accentColor?: string;
}) {
  const card = getCardWrapperStyles(cardStyle, accentColor);
  return (
    <div className={`flex flex-col items-center ${card.className}`} style={card.style}>
      <span className={`${sizeClass} tabular-nums`} style={style}>
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-xs uppercase opacity-70" style={{ textShadow: style.textShadow, fontWeight: style.fontWeight }}>{label}</span>
    </div>
  );
}

function FlipTimeBlock({
  value,
  label,
  sizeClass,
  style,
  cardStyle = "flip",
  accentColor = "#3b82f6",
}: {
  value: number;
  label: string;
  sizeClass: string;
  style: React.CSSProperties;
  cardStyle?: string;
  accentColor?: string;
}) {
  const prevRef = useRef(value);
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prevRef.current !== value && elRef.current) {
      elRef.current.classList.remove("flip-animate");
      void elRef.current.offsetWidth;
      elRef.current.classList.add("flip-animate");
      prevRef.current = value;
    }
  }, [value]);

  const card = getCardWrapperStyles(cardStyle, accentColor);
  const display = value.toString().padStart(2, "0");

  return (
    <div className={`flex flex-col items-center ${card.className}`} style={card.style}>
      <div ref={elRef} className="relative" style={{ perspective: "300px" }}>
        {/* Top half */}
        <div className="overflow-hidden" style={{ clipPath: "inset(0 0 50% 0)" }}>
          <span className={`${sizeClass} tabular-nums block`} style={style}>{display}</span>
        </div>
        {/* Divider line */}
        <div className="absolute left-0 right-0 top-1/2 h-px opacity-30" style={{ backgroundColor: accentColor }} />
        {/* Bottom half */}
        <div className="overflow-hidden" style={{ clipPath: "inset(50% 0 0 0)", marginTop: "-100%" }}>
          <span className={`${sizeClass} tabular-nums block`} style={style}>{display}</span>
        </div>
      </div>
      <span className="text-xs uppercase opacity-70" style={{ textShadow: style.textShadow, fontWeight: style.fontWeight }}>{label}</span>
    </div>
  );
}

function Separator({ accentColor, cardStyle = "none" }: { accentColor: string; cardStyle?: string }) {
  return (
    <span
      className={`text-2xl font-bold ${cardStyle !== "none" ? "self-center" : ""}`}
      style={{ color: accentColor, opacity: 0.5 }}
    >
      :
    </span>
  );
}
