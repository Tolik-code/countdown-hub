"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy } from "lucide-react";
import type { CountdownWithStyle } from "@/lib/types";

interface ExploreCardProps {
  countdown: CountdownWithStyle;
}

export function ExploreCard({ countdown }: ExploreCardProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();

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
      <CardContent className="pt-4">
        <h3 className="mb-1 font-semibold truncate">{countdown.title}</h3>
        <p className="mb-1 text-xs text-muted-foreground font-mono">/{countdown.slug}</p>
        <p className="mb-3 text-sm text-muted-foreground">
          {daysLeft > 0
            ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`
            : "Completed"}
          {" · "}
          {targetDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <a href={`/${countdown.slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1.5 size-3.5" />
              View
            </a>
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={handleUseAsTemplate}
          >
            <Copy className="mr-1.5 size-3.5" />
            Use as Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
