"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteCountdown, toggleCountdownStatus } from "@/lib/actions";
import type { CountdownWithStyle } from "@/lib/types";
import { Pencil, Trash2, Pause, Play, ExternalLink, Copy } from "lucide-react";
import { useTranslation } from "@/lib/i18n/locale-context";
import { DATE_LOCALE_MAP } from "@/lib/i18n";

interface CountdownCardProps {
  countdown: CountdownWithStyle;
}

export function CountdownCard({ countdown }: CountdownCardProps) {
  const [isPending, startTransition] = useTransition();
  const { t, locale } = useTranslation();

  const handleDelete = () => {
    if (!confirm(t("common.deleteConfirm"))) return;
    startTransition(() => {
      deleteCountdown(countdown.id);
    });
  };

  const handleToggle = () => {
    startTransition(() => {
      toggleCountdownStatus(countdown.id);
    });
  };

  const statusColor =
    countdown.status === "ACTIVE"
      ? "default"
      : countdown.status === "PAUSED"
        ? "secondary"
        : "outline";

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">
            {countdown.title}
          </CardTitle>
          <Badge variant={statusColor}>{countdown.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date(countdown.targetDate).toLocaleDateString(DATE_LOCALE_MAP[locale], {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-xs text-muted-foreground">
          /{countdown.slug}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={`/${countdown.slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5" />
              {t("common.view")}
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/${countdown.id}/edit`}>
              <Pencil className="size-3.5" />
              {t("common.edit")}
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/new?template=${countdown.id}`}>
              <Copy className="size-3.5" />
              {t("common.template")}
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            disabled={isPending || countdown.status === "COMPLETED"}
          >
            {countdown.status === "ACTIVE" ? (
              <Pause className="size-3.5" />
            ) : (
              <Play className="size-3.5" />
            )}
            {countdown.status === "ACTIVE" ? t("common.pause") : t("common.start")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            className="text-destructive hover:bg-destructive hover:text-white"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
