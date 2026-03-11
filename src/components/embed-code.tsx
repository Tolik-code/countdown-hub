"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";

interface EmbedCodeProps {
  slug: string;
}

export function EmbedCode({ slug }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const embedUrl = `${appUrl}/${slug}/embed`;
  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="300" frameborder="0" style="border:none;"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Embed Code</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
            {iframeCode}
          </pre>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="absolute right-2 top-2"
            onClick={handleCopy}
          >
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Public URL:{" "}
          <a
            href={`${appUrl}/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {appUrl}/{slug}
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
