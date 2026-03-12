import { getCountdownsByUser } from "@/lib/actions";
import { CountdownCard } from "@/components/countdown-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdBanner } from "@/components/ad-banner";
import { getServerDictionary, t } from "@/lib/i18n/server";

export default async function DashboardPage() {
  const countdowns = await getCountdownsByUser();
  const { dictionary: d } = await getServerDictionary();

  if (countdowns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="mb-2 text-2xl font-semibold">{t(d, "dashboard.noCountdownsTitle")}</h2>
        <p className="mb-6 text-muted-foreground">
          {t(d, "dashboard.noCountdownsDescription")}
        </p>
        <Button asChild>
          <Link href="/dashboard/new">
            <Plus className="size-4" />
            {t(d, "common.createCountdown")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-bold">{t(d, "dashboard.myCountdowns")}</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {countdowns.map((countdown) => (
          <CountdownCard key={countdown.id} countdown={countdown} />
        ))}
      </div>
      <div className="mt-6">
        <AdBanner variant="horizontal" className="min-h-[90px]" />
      </div>
    </div>
  );
}
