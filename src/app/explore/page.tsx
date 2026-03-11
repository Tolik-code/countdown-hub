import { getAllPublicCountdowns } from "@/lib/actions";
import { Header } from "@/components/header";
import { ExploreCard } from "@/components/explore-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Countdowns | CountdownHub",
  description: "Browse and discover countdown timers created by the community. Find inspiration and use any countdown as a template for your own.",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const countdowns = await getAllPublicCountdowns(q);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Explore Countdowns</h1>
        <p className="mb-6 text-muted-foreground">
          Discover countdowns from the community. Use any as a template to create your own.
        </p>

        <form className="mb-8 flex gap-2" action="/explore" method="GET">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              placeholder="Search countdowns..."
              defaultValue={q ?? ""}
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {countdowns.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            {q ? "No countdowns found matching your search." : "No countdowns yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {countdowns.map((countdown) => (
              <ExploreCard key={countdown.id} countdown={countdown} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
