import { prisma } from "@/lib/prisma";

const RESERVED_WORDS = [
  "dashboard",
  "sign-in",
  "sign-up",
  "api",
  "admin",
  "settings",
  "profile",
  "about",
  "help",
  "embed",
];

export function validateSlug(slug: string): string | null {
  if (slug.length < 3 || slug.length > 60) {
    return "Slug must be between 3 and 60 characters";
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return "Slug must be lowercase alphanumeric with hyphens only";
  }
  if (RESERVED_WORDS.includes(slug)) {
    return "This slug is reserved";
  }
  return null;
}

export async function slugAvailable(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const existing = await prisma.countdown.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!existing) return true;
  if (excludeId && existing.id === excludeId) return true;
  return false;
}

export function validateTitle(title: string): string | null {
  if (!title.trim()) return "Title is required";
  if (title.length > 200) return "Title must be under 200 characters";
  return null;
}

export function validateTargetDate(dateStr: string): string | null {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Invalid date";
  return null;
}

export function validateColor(color: string): string | null {
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
    return "Invalid hex color";
  }
  return null;
}

export function validateCustomCss(css: string): string | null {
  const lower = css.toLowerCase();
  if (/<script/i.test(lower)) return "Scripts not allowed in CSS";
  if (/javascript:/i.test(lower)) return "JavaScript URLs not allowed in CSS";
  if (/expression\s*\(/i.test(lower)) return "CSS expressions not allowed";
  if (/@import/i.test(lower)) return "CSS @import not allowed";
  return null;
}
