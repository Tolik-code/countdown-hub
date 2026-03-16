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
  const description = countdown.description || `Countdown to ${countdown.title}`;
  const keywords = countdown.seoKeywords
    ? countdown.seoKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
    : undefined;

  return {
    title: `${countdown.title} — Countdown Timer`,
    description,
    keywords,
    openGraph: {
      title: countdown.title,
      description,
      type: "website",
      url: `${appUrl}/${slug}`,
      images: [`${appUrl}/${slug}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: countdown.title,
      description,
      images: [`${appUrl}/${slug}/opengraph-image`],
    },
    alternates: {
      canonical: `${appUrl}/${slug}`,
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: countdown.title,
    description: countdown.description || `Countdown to ${countdown.title}`,
    startDate: countdown.targetDate.toISOString(),
    url: `${appUrl}/${slug}`,
    image: `${appUrl}/${slug}/opengraph-image`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: `${appUrl}/${slug}`,
    },
    organizer: {
      "@type": "Organization",
      name: "CountdownHub",
      url: appUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CountdownDisplay countdown={countdown} />
    </>
  );
}
