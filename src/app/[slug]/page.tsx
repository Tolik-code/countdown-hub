import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCountdownBySlug, autoCompleteCountdown } from "@/lib/actions";
import { CountdownDisplay } from "@/components/countdown-display";

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const countdown = await getCountdownBySlug(slug);
  if (!countdown) return { title: "Not Found" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    title: `${countdown.title} - CountdownHub`,
    description: countdown.description || `Countdown to ${countdown.title}`,
    openGraph: {
      title: countdown.title,
      description: countdown.description || `Countdown to ${countdown.title}`,
      images: [`${appUrl}/${slug}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: countdown.title,
      description: countdown.description || `Countdown to ${countdown.title}`,
      images: [`${appUrl}/${slug}/opengraph-image`],
    },
  };
}

export default async function CountdownPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const countdown = await getCountdownBySlug(slug);

  if (!countdown) {
    notFound();
  }

  // Auto-complete if target date has passed
  if (
    countdown.status === "ACTIVE" &&
    new Date(countdown.targetDate).getTime() < Date.now()
  ) {
    await autoCompleteCountdown(countdown.id);
    countdown.status = "COMPLETED";
  }

  return <CountdownDisplay countdown={countdown} />;
}
