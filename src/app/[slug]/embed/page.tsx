import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCountdownBySlug } from "@/lib/actions";
import { CountdownDisplay } from "@/components/countdown-display";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface EmbedPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { slug } = await params;
  const countdown = await getCountdownBySlug(slug);

  if (!countdown) {
    notFound();
  }

  return <CountdownDisplay countdown={countdown} minimal />;
}
