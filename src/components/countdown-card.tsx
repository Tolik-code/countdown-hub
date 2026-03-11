"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteCountdown, toggleCountdownStatus } from "@/lib/actions";
import type { CountdownWithStyle } from "@/lib/types";
import { Pencil, Trash2, Pause, Play, ExternalLink } from "lucide-react";

interface CountdownCardProps {
  countdown: CountdownWithStyle;
}

export function CountdownCard({ countdown }: CountdownCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Delete this countdown?")) return;
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
          {new Date(countdown.targetDate).toLocaleDateString("en-US", {
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
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={`/${countdown.slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5" />
              View
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/${countdown.id}/edit`}>
              <Pencil className="size-3.5" />
              Edit
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
            {countdown.status === "ACTIVE" ? "Pause" : "Start"}
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
