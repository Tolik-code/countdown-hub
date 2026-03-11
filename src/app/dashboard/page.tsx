import { getCountdownsByUser } from "@/lib/actions";
import { CountdownCard } from "@/components/countdown-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdBanner } from "@/components/ad-banner";

export default async function DashboardPage() {
  const countdowns = await getCountdownsByUser();

  if (countdowns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="mb-2 text-2xl font-semibold">No countdowns yet</h2>
        <p className="mb-6 text-muted-foreground">
          Create your first countdown timer to get started.
        </p>
        <Button asChild>
          <Link href="/dashboard/new">
            <Plus className="size-4" />
            Create Countdown
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Countdowns</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {countdowns.map((countdown) => (
          <CountdownCard key={countdown.id} countdown={countdown} />
        ))}
      </div>
      <div className="mt-6">
        <AdBanner slot="DASHBOARD_BOTTOM" format="horizontal" className="min-h-[90px]" />
      </div>
    </div>
  );
}
