"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/locale-context";

interface Draft {
  key: string;
  title: string;
  targetDate: string;
  updatedAt: string;
  countdownId?: string;
}

export function DraftCards() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const found: Draft[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith("countdown-draft-")) continue;
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const data = JSON.parse(raw);
        if (!data.title && !data.targetDate) continue;
        found.push({
          key,
          title: data.title || t("form.titlePlaceholder"),
          targetDate: data.targetDate || "",
          updatedAt: data.updatedAt || "",
          countdownId: data.countdownId,
        });
      }
    } catch {}
    found.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
    setDrafts(found);
  }, [t]);

  const handleDelete = (key: string) => {
    try { localStorage.removeItem(key); } catch {}
    setDrafts((prev) => prev.filter((d) => d.key !== key));
  };

  if (drafts.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg font-semibold text-muted-foreground">
        {t("dashboard.drafts")}
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {drafts.map((draft) => (
          <Card key={draft.key} className="border-dashed">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base leading-tight">
                  {draft.title}
                </CardTitle>
                <Badge variant="outline">{t("dashboard.draft")}</Badge>
              </div>
              {draft.targetDate && (
                <p className="text-sm text-muted-foreground">
                  {new Date(draft.targetDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {draft.updatedAt && (
                <p className="mb-3 text-xs text-muted-foreground">
                  {t("dashboard.lastEdited")}{" "}
                  {new Date(draft.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={
                      draft.countdownId
                        ? `/dashboard/${draft.countdownId}/edit`
                        : "/dashboard/new"
                    }
                  >
                    <Pencil className="size-3.5" />
                    {t("dashboard.continueDraft")}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(draft.key)}
                  className="text-destructive hover:bg-destructive hover:text-white"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
