"use client";

import { useTransition, useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CountdownPreview } from "@/components/countdown-preview";
import { EmbedCode } from "@/components/embed-code";
import { createCountdown, updateCountdown, checkSlugAvailability } from "@/lib/actions";
import type { CountdownWithStyle } from "@/lib/types";
import { Loader2, Upload } from "lucide-react";
import { EventDateLookup } from "@/components/event-date-lookup";
import { ScrollableTabs } from "@/components/scrollable-tabs";
import { useTranslation } from "@/lib/i18n/locale-context";

const FONT_OPTIONS = [
  "Inter",
  "Roboto",
  "Poppins",
  "Montserrat",
  "Playfair Display",
  "JetBrains Mono",
];

interface CountdownFormProps {
  countdown?: CountdownWithStyle;
  template?: CountdownWithStyle;
}

export function CountdownForm({ countdown, template }: CountdownFormProps) {
  const src = countdown ?? template;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const slugTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const { t } = useTranslation();

  const [title, setTitle] = useState(
    template ? t("form.copyOf", { title: template.title }) : (countdown?.title ?? "")
  );
  const [description, setDescription] = useState(src?.description ?? "");
  const [slug, setSlug] = useState(countdown?.slug ?? "");
  const [targetDate, setTargetDate] = useState(
    src?.targetDate
      ? new Date(src.targetDate).toISOString().slice(0, 16)
      : ""
  );
  const [backgroundColor, setBackgroundColor] = useState(
    src?.style?.backgroundColor ?? "#ffffff"
  );
  const [textColor, setTextColor] = useState(
    src?.style?.textColor ?? "#000000"
  );
  const [accentColor, setAccentColor] = useState(
    src?.style?.accentColor ?? "#3b82f6"
  );
  const [fontFamily, setFontFamily] = useState(
    src?.style?.fontFamily ?? "Inter"
  );
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    src?.style?.backgroundImageUrl ?? ""
  );
  const [displayFormat, setDisplayFormat] = useState(
    (src?.style?.displayFormat ?? "DHMS") as string
  );
  const [customCss, setCustomCss] = useState(
    src?.style?.customCss ?? ""
  );
  const [fontSize, setFontSize] = useState(
    src?.style?.fontSize ?? "md"
  );
  const [fontWeight, setFontWeight] = useState(
    src?.style?.fontWeight ?? "bold"
  );
  const [textBorder, setTextBorder] = useState(
    src?.style?.textBorder ?? "none"
  );
  const [textShadow, setTextShadow] = useState(
    src?.style?.textShadow ?? "none"
  );
  const [completionTitle, setCompletionTitle] = useState(
    src?.style?.completionTitle ?? "Time's Up!"
  );
  const [completionBgColor, setCompletionBgColor] = useState(
    src?.style?.completionBgColor ?? "#000000"
  );
  const [completionTextColor, setCompletionTextColor] = useState(
    src?.style?.completionTextColor ?? "#ffffff"
  );
  const [cardStyle, setCardStyle] = useState(
    src?.style?.cardStyle ?? "none"
  );
  const [animation, setAnimation] = useState(
    src?.style?.animation ?? "none"
  );
  const [animationImageUrl, setAnimationImageUrl] = useState(
    src?.style?.animationImageUrl ?? ""
  );
  const [seoKeywords, setSeoKeywords] = useState(
    countdown?.seoKeywords ?? ""
  );
  const [actionButtonText, setActionButtonText] = useState(
    src?.style?.actionButtonText ?? ""
  );
  const [actionButtonUrl, setActionButtonUrl] = useState(
    src?.style?.actionButtonUrl ?? ""
  );
  const [actionButtonBgColor, setActionButtonBgColor] = useState(
    src?.style?.actionButtonBgColor ?? "#3b82f6"
  );
  const [actionButtonTextColor, setActionButtonTextColor] = useState(
    src?.style?.actionButtonTextColor ?? "#ffffff"
  );
  const [actionButtonRadius, setActionButtonRadius] = useState(
    src?.style?.actionButtonRadius ?? "md"
  );
  const [actionButtonHoverColor, setActionButtonHoverColor] = useState(
    src?.style?.actionButtonHoverColor ?? ""
  );
  const [uploading, setUploading] = useState(false);
  const [uploadingAnim, setUploadingAnim] = useState(false);

  const draftKey = countdown
    ? `countdown-draft-edit-${countdown.id}`
    : "countdown-draft-new";

  // Load draft from localStorage on mount (only for new countdowns without template)
  const draftLoaded = useRef(false);
  useEffect(() => {
    if (draftLoaded.current || countdown || template) return;
    draftLoaded.current = true;
    try {
      const saved = localStorage.getItem(draftKey);
      if (!saved) return;
      const d = JSON.parse(saved);
      if (d.title) setTitle(d.title);
      if (d.description) setDescription(d.description);
      if (d.slug) { setSlug(d.slug); checkSlug(d.slug); }
      if (d.targetDate) setTargetDate(d.targetDate);
      if (d.backgroundColor) setBackgroundColor(d.backgroundColor);
      if (d.textColor) setTextColor(d.textColor);
      if (d.accentColor) setAccentColor(d.accentColor);
      if (d.fontFamily) setFontFamily(d.fontFamily);
      if (d.backgroundImageUrl) setBackgroundImageUrl(d.backgroundImageUrl);
      if (d.displayFormat) setDisplayFormat(d.displayFormat);
      if (d.customCss) setCustomCss(d.customCss);
      if (d.fontSize) setFontSize(d.fontSize);
      if (d.fontWeight) setFontWeight(d.fontWeight);
      if (d.textBorder) setTextBorder(d.textBorder);
      if (d.textShadow) setTextShadow(d.textShadow);
      if (d.completionTitle) setCompletionTitle(d.completionTitle);
      if (d.completionBgColor) setCompletionBgColor(d.completionBgColor);
      if (d.completionTextColor) setCompletionTextColor(d.completionTextColor);
      if (d.cardStyle) setCardStyle(d.cardStyle);
      if (d.animation) setAnimation(d.animation);
      if (d.animationImageUrl) setAnimationImageUrl(d.animationImageUrl);
      if (d.seoKeywords) setSeoKeywords(d.seoKeywords);
      if (d.actionButtonText) setActionButtonText(d.actionButtonText);
      if (d.actionButtonUrl) setActionButtonUrl(d.actionButtonUrl);
      if (d.actionButtonBgColor) setActionButtonBgColor(d.actionButtonBgColor);
      if (d.actionButtonTextColor) setActionButtonTextColor(d.actionButtonTextColor);
      if (d.actionButtonRadius) setActionButtonRadius(d.actionButtonRadius);
      if (d.actionButtonHoverColor) setActionButtonHoverColor(d.actionButtonHoverColor);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save draft to localStorage on every change
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      // Only save if there's meaningful content
      if (!title && !targetDate) return;
      try {
        localStorage.setItem(
          draftKey,
          JSON.stringify({
            title, description, slug, targetDate,
            backgroundColor, textColor, accentColor, fontFamily,
            backgroundImageUrl, displayFormat, customCss,
            fontSize, fontWeight, textBorder, textShadow,
            completionTitle, completionBgColor, completionTextColor,
            cardStyle, animation, animationImageUrl, seoKeywords,
            actionButtonText, actionButtonUrl, actionButtonBgColor,
            actionButtonTextColor, actionButtonRadius, actionButtonHoverColor,
            updatedAt: new Date().toISOString(),
            countdownId: countdown?.id,
          })
        );
      } catch {}
    }, 500);
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    title, description, slug, targetDate,
    backgroundColor, textColor, accentColor, fontFamily,
    backgroundImageUrl, displayFormat, customCss,
    fontSize, fontWeight, textBorder, textShadow,
    completionTitle, completionBgColor, completionTextColor,
    cardStyle, animation, animationImageUrl, seoKeywords,
    actionButtonText, actionButtonUrl, actionButtonBgColor,
    actionButtonTextColor, actionButtonRadius, actionButtonHoverColor,
  ]);

  const checkSlug = useCallback(
    (value: string) => {
      if (slugTimeout.current) clearTimeout(slugTimeout.current);
      if (value.length < 3) {
        setSlugStatus("idle");
        return;
      }
      setSlugStatus("checking");
      slugTimeout.current = setTimeout(async () => {
        const available = await checkSlugAvailability(value, countdown?.id);
        setSlugStatus(available ? "available" : "taken");
      }, 500);
    },
    [countdown?.id]
  );

  const handleSlugChange = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSlug(cleaned);
    checkSlug(cleaned);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "bg" | "anim") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const setLoading = target === "bg" ? setUploading : setUploadingAnim;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        if (target === "bg") setBackgroundImageUrl(data.url);
        else setAnimationImageUrl(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const action = countdown ? updateCountdown : createCountdown;
      const result = await action(formData);
      if (result.success) {
        try { localStorage.removeItem(draftKey); } catch {}
        router.push("/dashboard");
      } else {
        setError(result.error ?? "Something went wrong");
      }
    });
  };

  return (
    <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-6 min-w-0">
        {countdown && <input type="hidden" name="id" value={countdown.id} />}
        <input type="hidden" name="title" value={title} />
        <input type="hidden" name="description" value={description} />
        <input type="hidden" name="targetDate" value={targetDate} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="seoKeywords" value={seoKeywords} />
        <input type="hidden" name="backgroundColor" value={backgroundColor} />
        <input type="hidden" name="textColor" value={textColor} />
        <input type="hidden" name="accentColor" value={accentColor} />
        <input type="hidden" name="backgroundImageUrl" value={backgroundImageUrl} />
        <input type="hidden" name="displayFormat" value={displayFormat} />
        <input type="hidden" name="fontFamily" value={fontFamily} />
        <input type="hidden" name="fontSize" value={fontSize} />
        <input type="hidden" name="fontWeight" value={fontWeight} />
        <input type="hidden" name="textBorder" value={textBorder} />
        <input type="hidden" name="textShadow" value={textShadow} />
        <input type="hidden" name="completionTitle" value={completionTitle} />
        <input type="hidden" name="completionBgColor" value={completionBgColor} />
        <input type="hidden" name="completionTextColor" value={completionTextColor} />
        <input type="hidden" name="cardStyle" value={cardStyle} />
        <input type="hidden" name="animation" value={animation} />
        <input type="hidden" name="animationImageUrl" value={animationImageUrl} />
        <input type="hidden" name="customCss" value={customCss} />
        <input type="hidden" name="actionButtonText" value={actionButtonText} />
        <input type="hidden" name="actionButtonUrl" value={actionButtonUrl} />
        <input type="hidden" name="actionButtonBgColor" value={actionButtonBgColor} />
        <input type="hidden" name="actionButtonTextColor" value={actionButtonTextColor} />
        <input type="hidden" name="actionButtonRadius" value={actionButtonRadius} />
        <input type="hidden" name="actionButtonHoverColor" value={actionButtonHoverColor} />

        {error && (
          <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Tabs defaultValue="basic">
          <ScrollableTabs>
            <TabsList className="w-max flex-nowrap">
              <TabsTrigger value="basic" className="shrink-0">{t("form.tabs.basic")}</TabsTrigger>
              <TabsTrigger value="colors" className="shrink-0">{t("form.tabs.colors")}</TabsTrigger>
              <TabsTrigger value="typography" className="shrink-0">{t("form.tabs.typography")}</TabsTrigger>
              <TabsTrigger value="background" className="shrink-0">{t("form.tabs.background")}</TabsTrigger>
              <TabsTrigger value="display" className="shrink-0">{t("form.tabs.display")}</TabsTrigger>
              <TabsTrigger value="completion" className="shrink-0">{t("form.tabs.completion")}</TabsTrigger>
              <TabsTrigger value="action-button" className="shrink-0">{t("form.tabs.actionButton")}</TabsTrigger>
              <TabsTrigger value="animation" className="shrink-0">{t("form.tabs.animation")}</TabsTrigger>
              <TabsTrigger value="advanced" className="shrink-0">{t("form.tabs.advanced")}</TabsTrigger>
            </TabsList>
          </ScrollableTabs>

          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label htmlFor="title">{t("form.title")}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("form.titlePlaceholder")}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">{t("form.description")}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("form.descriptionPlaceholder")}
              />
            </div>
            <div>
              <Label htmlFor="targetDate">{t("form.targetDate")}</Label>
              <Input
                id="targetDate"
                type="datetime-local"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
              />
              <EventDateLookup onApply={(isoDate) => setTargetDate(isoDate.slice(0, 16))} />
            </div>
            <div>
              <Label htmlFor="slug">
                {t("form.slug")}{" "}
                {slugStatus === "checking" && (
                  <span className="text-muted-foreground">({t("form.slugChecking")})</span>
                )}
                {slugStatus === "available" && (
                  <span className="text-green-600">({t("form.slugAvailable")})</span>
                )}
                {slugStatus === "taken" && (
                  <span className="text-destructive">({t("form.slugTaken")})</span>
                )}
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder={t("form.slugPlaceholder")}
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {t("form.slugHint", { slug: slug || "your-slug" })}
              </p>
            </div>
            <div>
              <Label htmlFor="seoKeywords">{t("form.seoKeywords")}</Label>
              <Input
                id="seoKeywords"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder={t("form.seoKeywordsPlaceholder")}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {t("form.seoKeywordsHint")}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <div>
              <Label htmlFor="backgroundColor">{t("form.backgroundColor")}</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="backgroundColor"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer p-1"
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="textColor">{t("form.textColor")}</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="textColor"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer p-1"
                />
                <Input
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="accentColor">{t("form.accentColor")}</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="accentColor"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer p-1"
                />
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4">
            <div>
              <Label>{t("form.fontFamily")}</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("form.fontSize")}</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">{t("form.fontSizeSmall")}</SelectItem>
                  <SelectItem value="md">{t("form.fontSizeMedium")}</SelectItem>
                  <SelectItem value="lg">{t("form.fontSizeLarge")}</SelectItem>
                  <SelectItem value="xl">{t("form.fontSizeXl")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("form.fontWeight")}</Label>
              <Select value={fontWeight} onValueChange={setFontWeight}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t("form.fontWeightLight")}</SelectItem>
                  <SelectItem value="normal">{t("form.fontWeightNormal")}</SelectItem>
                  <SelectItem value="bold">{t("form.fontWeightBold")}</SelectItem>
                  <SelectItem value="black">{t("form.fontWeightBlack")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("form.textOutline")}</Label>
              <Select value={textBorder} onValueChange={setTextBorder}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("form.outlineNone")}</SelectItem>
                  <SelectItem value="thin">{t("form.outlineThin")}</SelectItem>
                  <SelectItem value="thick">{t("form.outlineThick")}</SelectItem>
                  <SelectItem value="white">{t("form.outlineWhite")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("form.textShadow")}</Label>
              <Select value={textShadow} onValueChange={setTextShadow}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("form.shadowNone")}</SelectItem>
                  <SelectItem value="sm">{t("form.shadowSmall")}</SelectItem>
                  <SelectItem value="md">{t("form.shadowMedium")}</SelectItem>
                  <SelectItem value="lg">{t("form.shadowLarge")}</SelectItem>
                  <SelectItem value="glow">{t("form.shadowGlow")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="background" className="space-y-4">
            <div>
              <Label>{t("form.backgroundImage")}</Label>
              <div className="mt-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed p-4 hover:bg-muted/50">
                  {uploading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Upload className="size-5" />
                  )}
                  <span className="text-sm">
                    {uploading
                      ? t("form.uploading")
                      : t("form.uploadHint")}
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => handleUpload(e, "bg")}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              {backgroundImageUrl && (
                <div className="mt-2">
                  <p className="mb-1 text-xs text-muted-foreground">{t("form.currentImage")}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={backgroundImageUrl}
                    alt="Background preview"
                    className="h-20 w-full rounded object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-1"
                    onClick={() => setBackgroundImageUrl("")}
                  >
                    {t("common.remove")}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-4">
            <div>
              <Label>{t("form.displayFormat")}</Label>
              <Select value={displayFormat} onValueChange={setDisplayFormat}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DHMS">
                    {t("form.formatDHMS")}
                  </SelectItem>
                  <SelectItem value="HMS">
                    {t("form.formatHMS")}
                  </SelectItem>
                  <SelectItem value="FULL">{t("form.formatFull")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("form.cardStyle")}</Label>
              <Select value={cardStyle} onValueChange={setCardStyle}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("form.cardStyleNone")}</SelectItem>
                  <SelectItem value="cards">{t("form.cardStyleCards")}</SelectItem>
                  <SelectItem value="flip">{t("form.cardStyleFlip")}</SelectItem>
                  <SelectItem value="glass">{t("form.cardStyleGlass")}</SelectItem>
                  <SelectItem value="neon">{t("form.cardStyleNeon")}</SelectItem>
                  <SelectItem value="minimal">{t("form.cardStyleMinimal")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="completion" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("form.completionHint")}
            </p>
            <div>
              <Label htmlFor="completionTitle">{t("form.completionMessage")}</Label>
              <Input
                id="completionTitle"
                value={completionTitle}
                onChange={(e) => setCompletionTitle(e.target.value)}
                placeholder={t("form.completionPlaceholder")}
              />
            </div>
            <div>
              <Label>{t("form.completionBgColor")}</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={completionBgColor}
                  onChange={(e) => setCompletionBgColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer p-1"
                />
                <Input
                  value={completionBgColor}
                  onChange={(e) => setCompletionBgColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label>{t("form.completionTextColor")}</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={completionTextColor}
                  onChange={(e) => setCompletionTextColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer p-1"
                />
                <Input
                  value={completionTextColor}
                  onChange={(e) => setCompletionTextColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="action-button" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("form.actionButtonHint")}
            </p>
            <div>
              <Label htmlFor="actionButtonText">{t("form.buttonText")}</Label>
              <Input
                id="actionButtonText"
                value={actionButtonText}
                onChange={(e) => setActionButtonText(e.target.value)}
                placeholder={t("form.buttonTextPlaceholder")}
              />
            </div>
            <div>
              <Label htmlFor="actionButtonUrl">{t("form.buttonUrl")}</Label>
              <Input
                id="actionButtonUrl"
                value={actionButtonUrl}
                onChange={(e) => setActionButtonUrl(e.target.value)}
                placeholder={t("form.buttonUrlPlaceholder")}
              />
            </div>
            <div>
              <Label>{t("form.buttonBgColor")}</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={actionButtonBgColor}
                  onChange={(e) => setActionButtonBgColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer p-1"
                />
                <Input
                  value={actionButtonBgColor}
                  onChange={(e) => setActionButtonBgColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label>{t("form.buttonTextColor")}</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={actionButtonTextColor}
                  onChange={(e) => setActionButtonTextColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer p-1"
                />
                <Input
                  value={actionButtonTextColor}
                  onChange={(e) => setActionButtonTextColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label>{t("form.borderRadius")}</Label>
              <Select value={actionButtonRadius} onValueChange={setActionButtonRadius}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("form.radiusNone")}</SelectItem>
                  <SelectItem value="sm">{t("form.radiusSmall")}</SelectItem>
                  <SelectItem value="md">{t("form.radiusMedium")}</SelectItem>
                  <SelectItem value="lg">{t("form.radiusLarge")}</SelectItem>
                  <SelectItem value="full">{t("form.radiusFull")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("form.hoverColor")}</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={actionButtonHoverColor || "#2563eb"}
                  onChange={(e) => setActionButtonHoverColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer p-1"
                />
                <Input
                  value={actionButtonHoverColor}
                  onChange={(e) => setActionButtonHoverColor(e.target.value)}
                  placeholder={t("form.hoverColorPlaceholder")}
                  className="flex-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="animation" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("form.animationHint")}
            </p>
            <div>
              <Label>{t("form.animationStyle")}</Label>
              <Select value={animation} onValueChange={setAnimation}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("form.animNone")}</SelectItem>
                  <SelectItem value="confetti">{t("form.animConfetti")}</SelectItem>
                  <SelectItem value="snow">{t("form.animSnow")}</SelectItem>
                  <SelectItem value="hearts">{t("form.animHearts")}</SelectItem>
                  <SelectItem value="stars">{t("form.animStars")}</SelectItem>
                  <SelectItem value="leaves">{t("form.animLeaves")}</SelectItem>
                  <SelectItem value="rain">{t("form.animRain")}</SelectItem>
                  <SelectItem value="custom">{t("form.animCustom")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {animation === "custom" && (
              <div>
                <Label>{t("form.customParticle")}</Label>
                <div className="mt-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed p-4 hover:bg-muted/50">
                    {uploadingAnim ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Upload className="size-5" />
                    )}
                    <span className="text-sm">
                      {uploadingAnim
                        ? t("form.uploading")
                        : t("form.uploadParticle")}
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => handleUpload(e, "anim")}
                      className="hidden"
                      disabled={uploadingAnim}
                    />
                  </label>
                </div>
                {animationImageUrl && (
                  <div className="mt-2 flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={animationImageUrl}
                      alt="Particle preview"
                      className="h-10 w-10 rounded object-contain"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAnimationImageUrl("")}
                    >
                      {t("common.remove")}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div>
              <Label htmlFor="customCss">{t("form.customCss")}</Label>
              <Textarea
                id="customCss"
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                placeholder=".countdown-container { ... }"
                className="font-mono text-sm"
                rows={6}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {t("form.customCssHint")}
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : countdown ? (
            t("common.updateCountdown")
          ) : (
            t("common.createCountdown")
          )}
        </Button>

        {countdown && <EmbedCode slug={countdown.slug} />}
      </form>

      <div className="lg:sticky lg:top-8 min-w-0">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          {t("form.livePreview")}
        </h3>
        <Card className="p-0 gap-0 overflow-hidden">
          <CardContent className="p-0">
            <CountdownPreview
              title={title}
              targetDate={targetDate}
              backgroundColor={backgroundColor}
              textColor={textColor}
              accentColor={accentColor}
              fontFamily={fontFamily}
              backgroundImageUrl={backgroundImageUrl || undefined}
              displayFormat={displayFormat}
              customCss={customCss || undefined}
              fontSize={fontSize}
              fontWeight={fontWeight}
              textBorder={textBorder}
              textShadow={textShadow}
              completionTitle={completionTitle}
              completionBgColor={completionBgColor}
              completionTextColor={completionTextColor}
              cardStyle={cardStyle}
              animation={animation}
              animationImageUrl={animationImageUrl || undefined}
              actionButtonText={actionButtonText || undefined}
              actionButtonUrl={actionButtonUrl || undefined}
              actionButtonBgColor={actionButtonBgColor}
              actionButtonTextColor={actionButtonTextColor}
              actionButtonRadius={actionButtonRadius}
              actionButtonHoverColor={actionButtonHoverColor || undefined}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
