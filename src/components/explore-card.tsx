"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy } from "lucide-react";
import type { CountdownWithStyle } from "@/lib/types";
import { useTranslation } from "@/lib/i18n/locale-context";
import { DATE_LOCALE_MAP } from "@/lib/i18n";

interface ExploreCardProps {
  countdown: CountdownWithStyle;
}

export function ExploreCard({ countdown }: ExploreCardProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const { t, locale } = useTranslation();

  const targetDate = new Date(countdown.targetDate);
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  const daysLeft = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;

  const handleUseAsTemplate = () => {
    if (isSignedIn) {
      router.push(`/dashboard/new?template=${countdown.id}`);
    } else {
      router.push("/sign-up");
    }
  };

  return (
    <Card>
      <CardContent className="px-4 py-4">
        <h3 className="mb-1 font-semibold truncate">{countdown.title}</h3>
        <p className="mb-1 text-xs text-muted-foreground font-mono">/{countdown.slug}</p>
        <p className="mb-3 text-sm text-muted-foreground">
          {daysLeft > 0
            ? t("explore.daysLeft", { count: daysLeft })
            : t("common.completed")}
          {" · "}
          {targetDate.toLocaleDateString(DATE_LOCALE_MAP[locale], {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <a href={`/${countdown.slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 size-3.5" />
              {t("common.view")}
            </a>
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={handleUseAsTemplate}
          >
            <Copy className="mr-1.5 size-3.5" />
            {t("explore.useAsTemplate")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
