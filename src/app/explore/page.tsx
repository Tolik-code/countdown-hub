import { getAllPublicCountdowns } from "@/lib/actions";
import { Header } from "@/components/header";
import { ExploreCard } from "@/components/explore-card";
import { AdBanner } from "@/components/ad-banner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { Metadata } from "next";
import { getServerDictionary, t } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dictionary: d } = await getServerDictionary();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const title = t(d, "explore.metaTitle");
  const description = t(d, "explore.metaDescription");
  return {
    title,
    description,
    keywords: ["countdown timer", "explore countdowns", "countdown templates", "event timer", "community countdowns"],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${appUrl}/explore`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${appUrl}/explore`,
    },
  };
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const countdowns = await getAllPublicCountdowns(q);
  const { dictionary: d } = await getServerDictionary();

  return (
    <div className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{t(d, "explore.title")}</h1>
        <p className="mb-6 text-muted-foreground">
          {t(d, "explore.description")}
        </p>

        <form className="mb-8 flex gap-2" action="/explore" method="GET">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              placeholder={t(d, "explore.searchPlaceholder")}
              defaultValue={q ?? ""}
              className="pl-9"
            />
          </div>
          <Button type="submit">{t(d, "common.search")}</Button>
        </form>

        {countdowns.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            {q ? t(d, "explore.noResults") : t(d, "explore.noCountdowns")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {countdowns.map((countdown) => (
              <ExploreCard key={countdown.id} countdown={countdown} />
            ))}
          </div>
        )}

        <div className="mt-6">
          <AdBanner variant="horizontal" className="min-h-[90px]" />
        </div>
      </div>
    </div>
  );
}
