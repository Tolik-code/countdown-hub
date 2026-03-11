"use client";

import { useEffect, useState, useRef } from "react";
import type { CountdownWithStyle } from "@/lib/types";
import { fontMap } from "@/lib/fonts";
import { FallingAnimation } from "@/components/falling-animation";
import { useTranslation } from "@/lib/i18n/locale-context";
import { DATE_LOCALE_MAP } from "@/lib/i18n";

interface CountdownDisplayProps {
  countdown: CountdownWithStyle;
  minimal?: boolean;
}

const FONT_SIZE_MAP: Record<string, { number: string; label: string; title: string; full: string }> = {
  sm: { number: "text-xl sm:text-3xl", label: "text-[10px] sm:text-xs", title: "text-lg sm:text-2xl", full: "text-lg sm:text-2xl" },
  md: { number: "text-3xl sm:text-6xl md:text-7xl", label: "text-[10px] sm:text-sm", title: "text-2xl sm:text-4xl md:text-5xl", full: "text-xl sm:text-4xl" },
  lg: { number: "text-4xl sm:text-7xl md:text-8xl", label: "text-xs sm:text-base", title: "text-3xl sm:text-5xl md:text-6xl", full: "text-2xl sm:text-5xl" },
  xl: { number: "text-5xl sm:text-8xl md:text-9xl", label: "text-xs sm:text-lg", title: "text-3xl sm:text-6xl md:text-7xl", full: "text-3xl sm:text-6xl" },
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
  const { t, locale } = useTranslation();
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
  const cStyle = style?.cardStyle ?? "none";
  const anim = style?.animation ?? "none";
  const animImg = style?.animationImageUrl;
  const abText = style?.actionButtonText;
  const abUrl = style?.actionButtonUrl;
  const abBgColor = style?.actionButtonBgColor ?? "#3b82f6";
  const abTextColor = style?.actionButtonTextColor ?? "#ffffff";
  const abRadius = style?.actionButtonRadius ?? "md";
  const abHoverColor = style?.actionButtonHoverColor;

  const ACTION_RADIUS_MAP: Record<string, string> = {
    none: "0",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
    full: "9999px",
  };

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
          className="countdown-container relative flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden"
          style={{
            backgroundColor: compBg,
            color: compText,
            fontFamily: font,
            minHeight: "100dvh",
          }}
        >
          {anim !== "none" && <FallingAnimation animation={anim} imageUrl={animImg ?? undefined} />}
          {!minimal && (
            <h1
              className={`mb-4 sm:mb-6 text-center ${sizes.title} relative z-10`}
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

          {!minimal && <CountdownFooter txtColor={compText} t={t} />}
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
        className="countdown-container relative flex flex-col items-center justify-center px-3 py-4 sm:p-8 overflow-hidden"
        style={{
          backgroundColor: bgColor,
          color: txtColor,
          fontFamily: font,
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100dvh",
        }}
      >
        {anim !== "none" && <FallingAnimation animation={anim} imageUrl={animImg ?? undefined} />}

        {!minimal && (
          <h1
            className={`mb-2 text-center ${sizes.title} relative z-10 px-2`}
            style={{ color: txtColor, textShadow: combinedShadow, fontWeight: fontWeightValue }}
          >
            {countdown.title}
          </h1>
        )}
        {!minimal && countdown.description && (
          <p
            className="mb-4 sm:mb-8 text-center text-base sm:text-lg opacity-80 relative z-10 px-2"
            style={{ color: txtColor, textShadow: combinedShadow }}
          >
            {countdown.description}
          </p>
        )}
        {minimal && (
          <h2
            className="mb-4 text-center text-lg sm:text-xl font-bold relative z-10 px-2"
            style={{ color: txtColor, textShadow: combinedShadow }}
          >
            {countdown.title}
          </h2>
        )}

        {isPaused ? (
          <div className="text-center relative z-10">
            <p className="text-xl sm:text-2xl font-semibold opacity-60" style={{ color: txtColor }}>
              {t("countdown.paused")}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-6 relative z-10">
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
                    {cStyle === "flip" ? (
                      <FlipTimeUnit value={timeLeft.days} label={t("countdown.days")} accent={accent} sizeNum={sizes.number} sizeLabel={sizes.label} shadow={combinedShadow} weight={fontWeightValue} cardStyle={cStyle} />
                    ) : (
                      <TimeUnit value={timeLeft.days} label={t("countdown.days")} accent={accent} sizeNum={sizes.number} sizeLabel={sizes.label} shadow={combinedShadow} weight={fontWeightValue} cardStyle={cStyle} />
                    )}
                    <Colon accent={accent} sizeNum={sizes.number} cardStyle={cStyle} />
                  </>
                )}
                {cStyle === "flip" ? (
                  <FlipTimeUnit
                    value={format === "HMS" ? timeLeft.hours + timeLeft.days * 24 : timeLeft.hours}
                    label={t("countdown.hours")}
                    accent={accent}
                    sizeNum={sizes.number}
                    sizeLabel={sizes.label}
                    shadow={combinedShadow}
                    weight={fontWeightValue}
                    cardStyle={cStyle}
                  />
                ) : (
                  <TimeUnit
                    value={format === "HMS" ? timeLeft.hours + timeLeft.days * 24 : timeLeft.hours}
                    label={t("countdown.hours")}
                    accent={accent}
                    sizeNum={sizes.number}
                    sizeLabel={sizes.label}
                    shadow={combinedShadow}
                    weight={fontWeightValue}
                    cardStyle={cStyle}
                  />
                )}
                <Colon accent={accent} sizeNum={sizes.number} cardStyle={cStyle} />
                {cStyle === "flip" ? (
                  <FlipTimeUnit value={timeLeft.minutes} label={t("countdown.minutes")} accent={accent} sizeNum={sizes.number} sizeLabel={sizes.label} shadow={combinedShadow} weight={fontWeightValue} cardStyle={cStyle} />
                ) : (
                  <TimeUnit value={timeLeft.minutes} label={t("countdown.minutes")} accent={accent} sizeNum={sizes.number} sizeLabel={sizes.label} shadow={combinedShadow} weight={fontWeightValue} cardStyle={cStyle} />
                )}
                <Colon accent={accent} sizeNum={sizes.number} cardStyle={cStyle} />
                {cStyle === "flip" ? (
                  <FlipTimeUnit value={timeLeft.seconds} label={t("countdown.seconds")} accent={accent} sizeNum={sizes.number} sizeLabel={sizes.label} shadow={combinedShadow} weight={fontWeightValue} cardStyle={cStyle} />
                ) : (
                  <TimeUnit value={timeLeft.seconds} label={t("countdown.seconds")} accent={accent} sizeNum={sizes.number} sizeLabel={sizes.label} shadow={combinedShadow} weight={fontWeightValue} cardStyle={cStyle} />
                )}
              </>
            )}
          </div>
        )}

        {abText && abUrl && (
          <ActionButton
            text={abText}
            url={abUrl}
            bgColor={abBgColor}
            textColor={abTextColor}
            radius={ACTION_RADIUS_MAP[abRadius] ?? "0.5rem"}
            hoverColor={abHoverColor ?? undefined}
          />
        )}

        {!minimal && (
          <p className="mt-4 sm:mt-8 text-xs sm:text-sm opacity-50 relative z-10 px-2 text-center" style={{ color: txtColor, textShadow: combinedShadow, fontWeight: fontWeightValue }}>
            {new Date(countdown.targetDate).toLocaleDateString(DATE_LOCALE_MAP[locale], {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}

        {!minimal && <CountdownFooter txtColor={txtColor} t={t} />}
      </div>
    </>
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

function TimeUnit({
  value,
  label,
  accent,
  sizeNum,
  sizeLabel,
  shadow,
  weight,
  cardStyle = "none",
}: {
  value: number;
  label: string;
  accent: string;
  sizeNum: string;
  sizeLabel: string;
  shadow: string;
  weight: number;
  cardStyle?: string;
}) {
  const card = getCardWrapperStyles(cardStyle, accent);
  return (
    <div className={`flex flex-col items-center min-w-0 ${card.className}`} style={card.style}>
      <span
        className={`${sizeNum} tabular-nums leading-tight`}
        style={{ color: accent, textShadow: shadow, fontWeight: weight }}
      >
        {value.toString().padStart(2, "0")}
      </span>
      <span className={`mt-1 ${sizeLabel} uppercase tracking-wider sm:tracking-widest opacity-60`} style={{ textShadow: shadow, fontWeight: weight }}>
        {label}
      </span>
    </div>
  );
}

function FlipTimeUnit({
  value,
  label,
  accent,
  sizeNum,
  sizeLabel,
  shadow,
  weight,
  cardStyle = "flip",
}: {
  value: number;
  label: string;
  accent: string;
  sizeNum: string;
  sizeLabel: string;
  shadow: string;
  weight: number;
  cardStyle?: string;
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

  const card = getCardWrapperStyles(cardStyle, accent);
  const display = value.toString().padStart(2, "0");

  return (
    <div className={`flex flex-col items-center min-w-0 ${card.className}`} style={card.style}>
      <div ref={elRef} className="relative" style={{ perspective: "300px" }}>
        <div className="overflow-hidden" style={{ clipPath: "inset(0 0 50% 0)" }}>
          <span className={`${sizeNum} tabular-nums leading-tight block`} style={{ color: accent, textShadow: shadow, fontWeight: weight }}>{display}</span>
        </div>
        <div className="absolute left-0 right-0 top-1/2 h-px opacity-30" style={{ backgroundColor: accent }} />
        <div className="overflow-hidden" style={{ clipPath: "inset(50% 0 0 0)", marginTop: "-100%" }}>
          <span className={`${sizeNum} tabular-nums leading-tight block`} style={{ color: accent, textShadow: shadow, fontWeight: weight }}>{display}</span>
        </div>
      </div>
      <span className={`mt-1 ${sizeLabel} uppercase tracking-wider sm:tracking-widest opacity-60`} style={{ textShadow: shadow, fontWeight: weight }}>
        {label}
      </span>
    </div>
  );
}

function Colon({ accent, cardStyle = "none" }: { accent: string; sizeNum: string; cardStyle?: string }) {
  return (
    <span
      className={`mb-4 text-lg sm:text-3xl md:text-5xl font-bold ${cardStyle !== "none" ? "self-center" : ""}`}
      style={{ color: accent, opacity: 0.4 }}
    >
      :
    </span>
  );
}

function ActionButton({
  text,
  url,
  bgColor,
  textColor,
  radius,
  hoverColor,
}: {
  text: string;
  url: string;
  bgColor: string;
  textColor: string;
  radius: string;
  hoverColor?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 sm:mt-6 inline-block px-8 py-3 text-base sm:text-lg font-medium transition-colors relative z-10"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: radius,
      }}
      onMouseEnter={(e) =>
        hoverColor && (e.currentTarget.style.backgroundColor = hoverColor)
      }
      onMouseLeave={(e) =>
        hoverColor && (e.currentTarget.style.backgroundColor = bgColor)
      }
    >
      {text}
    </a>
  );
}

function CountdownFooter({ txtColor, t }: { txtColor: string; t: (key: string, params?: Record<string, string | number>) => string }) {
  return (
    <footer
      className="absolute bottom-0 left-0 right-0 z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs backdrop-blur-sm"
      style={{ color: txtColor, backgroundColor: "rgba(0,0,0,0.25)" }}
    >
      <a href="/" className="opacity-80 hover:opacity-100 transition-opacity underline">{t("common.createYourOwn")}</a>
      <span className="opacity-60">&middot;</span>
      <a href="/privacy" className="opacity-60 hover:opacity-100 transition-opacity">{t("common.privacy")}</a>
      <span className="opacity-60">&middot;</span>
      <a href="/terms" className="opacity-60 hover:opacity-100 transition-opacity">{t("common.terms")}</a>
    </footer>
  );
}
