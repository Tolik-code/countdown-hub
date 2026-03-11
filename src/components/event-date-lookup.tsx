"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

interface LookupResult {
  eventName: string;
  date: string;
  confidence: "high" | "medium" | "low";
  source: string;
}

const confidenceColors: Record<string, string> = {
  high: "bg-green-100 text-green-800 border-green-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  low: "bg-red-100 text-red-800 border-red-300",
};

export function EventDateLookup({
  onApply,
}: {
  onApply: (isoDate: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim() || loading || cooldown) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/lookup-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      if (data.eventName && data.date) {
        setResult({
          eventName: data.eventName,
          date: data.date,
          confidence: data.confidence,
          source: data.source,
        });
      } else {
        setError(data.message || "Could not determine a date for this event.");
      }
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
      setCooldown(true);
      setTimeout(() => setCooldown(false), 3000);
    }
  }, [query, loading, cooldown]);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-2 space-y-2">
      <Label className="text-xs text-muted-foreground">AI Date Finder</Label>
      <div className="flex gap-2">
        <Input
          placeholder='e.g. "next Super Bowl"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          className="text-sm"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSearch}
          disabled={loading || cooldown || !query.trim()}
          className="shrink-0"
        >
          <Sparkles className="h-4 w-4 mr-1" />
          {loading ? "Finding..." : "Find"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-md border p-3 space-y-2 bg-muted/50">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-sm">{result.eventName}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(result.date)}
              </p>
            </div>
            <Badge
              variant="outline"
              className={confidenceColors[result.confidence]}
            >
              {result.confidence.toUpperCase()}
            </Badge>
          </div>
          {result.source && (
            <p className="text-xs text-muted-foreground">{result.source}</p>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onApply(result.date);
                setResult(null);
                setQuery("");
              }}
            >
              Apply Date
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setResult(null)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
