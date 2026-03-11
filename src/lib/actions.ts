"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  validateSlug,
  slugAvailable,
  validateTitle,
  validateTargetDate,
  validateColor,
  validateCustomCss,
} from "@/lib/validators";
import type { CountdownWithStyle } from "@/lib/types";
import { DisplayFormat } from "@prisma/client";

interface ActionResult {
  success: boolean;
  error?: string;
  id?: string;
}

export async function createCountdown(formData: FormData): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || undefined;
  const slug = formData.get("slug") as string;
  const targetDate = formData.get("targetDate") as string;
  const seoKeywords = (formData.get("seoKeywords") as string) || undefined;
  const backgroundColor = (formData.get("backgroundColor") as string) || "#ffffff";
  const textColor = (formData.get("textColor") as string) || "#000000";
  const accentColor = (formData.get("accentColor") as string) || "#3b82f6";
  const fontFamily = (formData.get("fontFamily") as string) || "Inter";
  const backgroundImageUrl = (formData.get("backgroundImageUrl") as string) || undefined;
  const displayFormat = (formData.get("displayFormat") as string) || "DHMS";
  const customCss = (formData.get("customCss") as string) || undefined;
  const fontSize = (formData.get("fontSize") as string) || "md";
  const fontWeight = (formData.get("fontWeight") as string) || "bold";
  const textBorder = (formData.get("textBorder") as string) || "none";
  const textShadow = (formData.get("textShadow") as string) || "none";
  const completionTitle = (formData.get("completionTitle") as string) || "Time's Up!";
  const completionBgColor = (formData.get("completionBgColor") as string) || "#000000";
  const completionTextColor = (formData.get("completionTextColor") as string) || "#ffffff";
  const cardStyleRaw = (formData.get("cardStyle") as string) || "none";
  const cardStyle = ["none", "cards", "flip", "glass", "neon", "minimal"].includes(cardStyleRaw) ? cardStyleRaw : "none";
  const animation = (formData.get("animation") as string) || "none";
  const animationImageUrl = (formData.get("animationImageUrl") as string) || undefined;
  const actionButtonText = (formData.get("actionButtonText") as string) || undefined;
  const actionButtonUrl = (formData.get("actionButtonUrl") as string) || undefined;
  const actionButtonBgColor = (formData.get("actionButtonBgColor") as string) || "#3b82f6";
  const actionButtonTextColor = (formData.get("actionButtonTextColor") as string) || "#ffffff";
  const actionButtonRadius = (formData.get("actionButtonRadius") as string) || "md";
  const actionButtonHoverColor = (formData.get("actionButtonHoverColor") as string) || undefined;

  const titleErr = validateTitle(title);
  if (titleErr) return { success: false, error: titleErr };

  const slugErr = validateSlug(slug);
  if (slugErr) return { success: false, error: slugErr };

  const available = await slugAvailable(slug);
  if (!available) return { success: false, error: "Slug is already taken" };

  const dateErr = validateTargetDate(targetDate);
  if (dateErr) return { success: false, error: dateErr };

  for (const color of [backgroundColor, textColor, accentColor]) {
    const colorErr = validateColor(color);
    if (colorErr) return { success: false, error: colorErr };
  }

  if (customCss) {
    const cssErr = validateCustomCss(customCss);
    if (cssErr) return { success: false, error: cssErr };
  }

  const countdown = await prisma.countdown.create({
    data: {
      title,
      description,
      slug,
      targetDate: new Date(targetDate),
      userId,
      seoKeywords,
      style: {
        create: {
          backgroundColor,
          textColor,
          accentColor,
          fontFamily,
          backgroundImageUrl,
          displayFormat: displayFormat as DisplayFormat,
          customCss,
          fontSize,
          fontWeight,
          textBorder,
          textShadow,
          completionTitle,
          completionBgColor,
          completionTextColor,
          cardStyle,
          animation,
          animationImageUrl,
          actionButtonText,
          actionButtonUrl,
          actionButtonBgColor,
          actionButtonTextColor,
          actionButtonRadius,
          actionButtonHoverColor,
        },
      },
    },
  });

  revalidatePath("/dashboard");
  return { success: true, id: countdown.id };
}

export async function updateCountdown(formData: FormData): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const id = formData.get("id") as string;
  const existing = await prisma.countdown.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return { success: false, error: "Not found" };
  }

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || undefined;
  const slug = formData.get("slug") as string;
  const targetDate = formData.get("targetDate") as string;
  const seoKeywords = (formData.get("seoKeywords") as string) || undefined;
  const backgroundColor = (formData.get("backgroundColor") as string) || "#ffffff";
  const textColor = (formData.get("textColor") as string) || "#000000";
  const accentColor = (formData.get("accentColor") as string) || "#3b82f6";
  const fontFamily = (formData.get("fontFamily") as string) || "Inter";
  const backgroundImageUrl = (formData.get("backgroundImageUrl") as string) || undefined;
  const displayFormat = (formData.get("displayFormat") as string) || "DHMS";
  const customCss = (formData.get("customCss") as string) || undefined;
  const fontSize = (formData.get("fontSize") as string) || "md";
  const fontWeight = (formData.get("fontWeight") as string) || "bold";
  const textBorder = (formData.get("textBorder") as string) || "none";
  const textShadow = (formData.get("textShadow") as string) || "none";
  const completionTitle = (formData.get("completionTitle") as string) || "Time's Up!";
  const completionBgColor = (formData.get("completionBgColor") as string) || "#000000";
  const completionTextColor = (formData.get("completionTextColor") as string) || "#ffffff";
  const cardStyleRaw = (formData.get("cardStyle") as string) || "none";
  const cardStyle = ["none", "cards", "flip", "glass", "neon", "minimal"].includes(cardStyleRaw) ? cardStyleRaw : "none";
  const animation = (formData.get("animation") as string) || "none";
  const animationImageUrl = (formData.get("animationImageUrl") as string) || undefined;
  const actionButtonText = (formData.get("actionButtonText") as string) || undefined;
  const actionButtonUrl = (formData.get("actionButtonUrl") as string) || undefined;
  const actionButtonBgColor = (formData.get("actionButtonBgColor") as string) || "#3b82f6";
  const actionButtonTextColor = (formData.get("actionButtonTextColor") as string) || "#ffffff";
  const actionButtonRadius = (formData.get("actionButtonRadius") as string) || "md";
  const actionButtonHoverColor = (formData.get("actionButtonHoverColor") as string) || undefined;

  const titleErr = validateTitle(title);
  if (titleErr) return { success: false, error: titleErr };

  const slugErr = validateSlug(slug);
  if (slugErr) return { success: false, error: slugErr };

  const available = await slugAvailable(slug, id);
  if (!available) return { success: false, error: "Slug is already taken" };

  const dateErr = validateTargetDate(targetDate);
  if (dateErr) return { success: false, error: dateErr };

  for (const color of [backgroundColor, textColor, accentColor]) {
    const colorErr = validateColor(color);
    if (colorErr) return { success: false, error: colorErr };
  }

  if (customCss) {
    const cssErr = validateCustomCss(customCss);
    if (cssErr) return { success: false, error: cssErr };
  }

  const styleData = {
    backgroundColor,
    textColor,
    accentColor,
    fontFamily,
    backgroundImageUrl,
    displayFormat: displayFormat as DisplayFormat,
    customCss,
    fontSize,
    fontWeight,
    textBorder,
    textShadow,
    completionTitle,
    completionBgColor,
    completionTextColor,
    cardStyle,
    animation,
    animationImageUrl,
    actionButtonText,
    actionButtonUrl,
    actionButtonBgColor,
    actionButtonTextColor,
    actionButtonRadius,
    actionButtonHoverColor,
  };

  await prisma.countdown.update({
    where: { id },
    data: {
      title,
      description,
      slug,
      targetDate: new Date(targetDate),
      seoKeywords,
      style: {
        upsert: {
          create: styleData,
          update: styleData,
        },
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/${slug}`);
  return { success: true, id };
}

export async function deleteCountdown(id: string): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const existing = await prisma.countdown.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return { success: false, error: "Not found" };
  }

  await prisma.countdown.delete({ where: { id } });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleCountdownStatus(id: string): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const existing = await prisma.countdown.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) {
    return { success: false, error: "Not found" };
  }

  const newStatus = existing.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
  await prisma.countdown.update({
    where: { id },
    data: { status: newStatus },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getCountdownsByUser(): Promise<CountdownWithStyle[]> {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.countdown.findMany({
    where: { userId },
    include: { style: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCountdownBySlug(
  slug: string
): Promise<CountdownWithStyle | null> {
  return prisma.countdown.findUnique({
    where: { slug },
    include: { style: true },
  });
}

export async function getCountdownById(
  id: string
): Promise<CountdownWithStyle | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const countdown = await prisma.countdown.findUnique({
    where: { id },
    include: { style: true },
  });

  if (!countdown || countdown.userId !== userId) return null;
  return countdown;
}

export async function autoCompleteCountdown(id: string): Promise<void> {
  await prisma.countdown.update({
    where: { id },
    data: { status: "COMPLETED" },
  });
}

export async function checkSlugAvailability(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const slugErr = validateSlug(slug);
  if (slugErr) return false;
  return slugAvailable(slug, excludeId);
}

export async function getAllPublicCountdowns(search?: string): Promise<CountdownWithStyle[]> {
  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (search && search.trim()) {
    const term = search.trim();
    where.OR = [
      { title: { contains: term, mode: "insensitive" } },
      { slug: { contains: term, mode: "insensitive" } },
    ];
  }
  return prisma.countdown.findMany({
    where,
    include: { style: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getCountdownPublicById(id: string): Promise<CountdownWithStyle | null> {
  return prisma.countdown.findUnique({
    where: { id },
    include: { style: true },
  });
}
