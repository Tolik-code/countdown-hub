"use client";

import { useTransition, useState, useCallback, useRef } from "react";
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
}

export function CountdownForm({ countdown }: CountdownFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const slugTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const [title, setTitle] = useState(countdown?.title ?? "");
  const [description, setDescription] = useState(countdown?.description ?? "");
  const [slug, setSlug] = useState(countdown?.slug ?? "");
  const [targetDate, setTargetDate] = useState(
    countdown?.targetDate
      ? new Date(countdown.targetDate).toISOString().slice(0, 16)
      : ""
  );
  const [backgroundColor, setBackgroundColor] = useState(
    countdown?.style?.backgroundColor ?? "#ffffff"
  );
  const [textColor, setTextColor] = useState(
    countdown?.style?.textColor ?? "#000000"
  );
  const [accentColor, setAccentColor] = useState(
    countdown?.style?.accentColor ?? "#3b82f6"
  );
  const [fontFamily, setFontFamily] = useState(
    countdown?.style?.fontFamily ?? "Inter"
  );
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(
    countdown?.style?.backgroundImageUrl ?? ""
  );
  const [displayFormat, setDisplayFormat] = useState(
    (countdown?.style?.displayFormat ?? "DHMS") as string
  );
  const [customCss, setCustomCss] = useState(
    countdown?.style?.customCss ?? ""
  );
  const [fontSize, setFontSize] = useState(
    countdown?.style?.fontSize ?? "md"
  );
  const [fontWeight, setFontWeight] = useState(
    countdown?.style?.fontWeight ?? "bold"
  );
  const [textBorder, setTextBorder] = useState(
    countdown?.style?.textBorder ?? "none"
  );
  const [textShadow, setTextShadow] = useState(
    countdown?.style?.textShadow ?? "none"
  );
  const [completionTitle, setCompletionTitle] = useState(
    countdown?.style?.completionTitle ?? "Time's Up!"
  );
  const [completionBgColor, setCompletionBgColor] = useState(
    countdown?.style?.completionBgColor ?? "#000000"
  );
  const [completionTextColor, setCompletionTextColor] = useState(
    countdown?.style?.completionTextColor ?? "#ffffff"
  );
  const [animation, setAnimation] = useState(
    countdown?.style?.animation ?? "none"
  );
  const [animationImageUrl, setAnimationImageUrl] = useState(
    countdown?.style?.animationImageUrl ?? ""
  );
  const [seoKeywords, setSeoKeywords] = useState(
    countdown?.seoKeywords ?? ""
  );
  const [uploading, setUploading] = useState(false);
  const [uploadingAnim, setUploadingAnim] = useState(false);

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
        router.push("/dashboard");
      } else {
        setError(result.error ?? "Something went wrong");
      }
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-6">
        {countdown && <input type="hidden" name="id" value={countdown.id} />}
        {/* Hidden inputs ensure all values are in FormData regardless of active tab */}
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
        <input type="hidden" name="animation" value={animation} />
        <input type="hidden" name="animationImageUrl" value={animationImageUrl} />
        <input type="hidden" name="customCss" value={customCss} />

        {error && (
          <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Tabs defaultValue="basic">
          <ScrollableTabs>
            <TabsList className="w-max flex-nowrap">
              <TabsTrigger value="basic" className="shrink-0">Basic</TabsTrigger>
              <TabsTrigger value="colors" className="shrink-0">Colors</TabsTrigger>
              <TabsTrigger value="typography" className="shrink-0">Text</TabsTrigger>
              <TabsTrigger value="background" className="shrink-0">Background</TabsTrigger>
              <TabsTrigger value="display" className="shrink-0">Display</TabsTrigger>
              <TabsTrigger value="completion" className="shrink-0">Completion</TabsTrigger>
              <TabsTrigger value="animation" className="shrink-0">Animation</TabsTrigger>
              <TabsTrigger value="advanced" className="shrink-0">Advanced</TabsTrigger>
            </TabsList>
          </ScrollableTabs>

          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Countdown"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you counting down to?"
              />
            </div>
            <div>
              <Label htmlFor="targetDate">Target Date</Label>
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
                URL Slug{" "}
                {slugStatus === "checking" && (
                  <span className="text-muted-foreground">(checking...)</span>
                )}
                {slugStatus === "available" && (
                  <span className="text-green-600">(available)</span>
                )}
                {slugStatus === "taken" && (
                  <span className="text-destructive">(taken)</span>
                )}
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="my-countdown"
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Your countdown will be at /{slug || "your-slug"}
              </p>
            </div>
            <div>
              <Label htmlFor="seoKeywords">SEO Keywords (optional)</Label>
              <Input
                id="seoKeywords"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="birthday countdown, event timer, new year"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Comma-separated keywords to help search engines find your countdown.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <div>
              <Label htmlFor="backgroundColor">Background Color</Label>
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
              <Label htmlFor="textColor">Text Color</Label>
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
              <Label htmlFor="accentColor">Accent Color (numbers)</Label>
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
              <Label>Font Family</Label>
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
              <Label>Font Size</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Font Weight</Label>
              <Select value={fontWeight} onValueChange={setFontWeight}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Text Outline</Label>
              <Select value={textBorder} onValueChange={setTextBorder}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="thin">Thin Dark</SelectItem>
                  <SelectItem value="thick">Thick Dark</SelectItem>
                  <SelectItem value="white">White Outline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Text Shadow</Label>
              <Select value={textShadow} onValueChange={setTextShadow}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="sm">Small</SelectItem>
                  <SelectItem value="md">Medium</SelectItem>
                  <SelectItem value="lg">Large</SelectItem>
                  <SelectItem value="glow">Glow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="background" className="space-y-4">
            <div>
              <Label>Background Image</Label>
              <div className="mt-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed p-4 hover:bg-muted/50">
                  {uploading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Upload className="size-5" />
                  )}
                  <span className="text-sm">
                    {uploading
                      ? "Uploading..."
                      : "Click to upload (PNG, JPEG, WebP, max 2MB)"}
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
                  <p className="mb-1 text-xs text-muted-foreground">Current image:</p>
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
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-4">
            <div>
              <Label>Display Format</Label>
              <Select value={displayFormat} onValueChange={setDisplayFormat}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DHMS">
                    Days / Hours / Minutes / Seconds
                  </SelectItem>
                  <SelectItem value="HMS">
                    Hours / Minutes / Seconds (no days)
                  </SelectItem>
                  <SelectItem value="FULL">Compact text format</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="completion" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Customize what visitors see when the countdown reaches zero.
            </p>
            <div>
              <Label htmlFor="completionTitle">Completion Message</Label>
              <Input
                id="completionTitle"
                value={completionTitle}
                onChange={(e) => setCompletionTitle(e.target.value)}
                placeholder="Time's Up!"
              />
            </div>
            <div>
              <Label>Background Color</Label>
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
              <Label>Text Color</Label>
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

          <TabsContent value="animation" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Add falling particle animations to your countdown page.
            </p>
            <div>
              <Label>Animation Style</Label>
              <Select value={animation} onValueChange={setAnimation}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="confetti">Confetti 🎊</SelectItem>
                  <SelectItem value="snow">Snow ❄️</SelectItem>
                  <SelectItem value="hearts">Hearts ❤️</SelectItem>
                  <SelectItem value="stars">Stars ⭐</SelectItem>
                  <SelectItem value="leaves">Leaves 🍂</SelectItem>
                  <SelectItem value="rain">Rain 💧</SelectItem>
                  <SelectItem value="custom">Custom Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {animation === "custom" && (
              <div>
                <Label>Custom Particle Image</Label>
                <div className="mt-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed p-4 hover:bg-muted/50">
                    {uploadingAnim ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Upload className="size-5" />
                    )}
                    <span className="text-sm">
                      {uploadingAnim
                        ? "Uploading..."
                        : "Upload PNG image for falling particles"}
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
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div>
              <Label htmlFor="customCss">Custom CSS</Label>
              <Textarea
                id="customCss"
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                placeholder=".countdown-container { ... }"
                className="font-mono text-sm"
                rows={6}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Add custom CSS to style your countdown page.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : countdown ? (
            "Update Countdown"
          ) : (
            "Create Countdown"
          )}
        </Button>

        {countdown && <EmbedCode slug={countdown.slug} />}
      </form>

      <div className="lg:sticky lg:top-8">
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Live Preview
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
              animation={animation}
              animationImageUrl={animationImageUrl || undefined}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
