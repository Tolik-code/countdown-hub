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
  const [uploading, setUploading] = useState(false);

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setBackgroundImageUrl(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
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
        <input type="hidden" name="backgroundImageUrl" value={backgroundImageUrl} />
        <input type="hidden" name="displayFormat" value={displayFormat} />
        <input type="hidden" name="fontFamily" value={fontFamily} />

        {error && (
          <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Tabs defaultValue="basic">
          <TabsList className="w-full">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Font</TabsTrigger>
            <TabsTrigger value="background">Background</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
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
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you counting down to?"
              />
            </div>
            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                name="targetDate"
                type="datetime-local"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
              />
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
                name="slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="my-countdown"
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Your countdown will be at /{slug || "your-slug"}
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
                  name="backgroundColor"
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
                  name="textColor"
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
                  name="accentColor"
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
                <SelectTrigger>
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
                    onChange={handleUpload}
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
                <SelectTrigger>
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

          <TabsContent value="advanced" className="space-y-4">
            <div>
              <Label htmlFor="customCss">Custom CSS</Label>
              <Textarea
                id="customCss"
                name="customCss"
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
        <Card>
          <CardContent className="p-0 overflow-hidden rounded-lg">
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
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
