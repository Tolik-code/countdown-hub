"use client";

import { useEffect, useRef } from "react";

type AdVariant = "horizontal" | "small-skyscraper" | "skyscraper";

interface AdBannerProps {
  variant: AdVariant;
  className?: string;
}

const AD_CONFIG = {
  horizontal: {
    type: "container" as const,
    scriptSrc: "https://drainalmost.com/7ffadc48149a5b331142520ab6902203/invoke.js",
    containerId: "container-7ffadc48149a5b331142520ab6902203",
  },
  "small-skyscraper": {
    type: "atOptions" as const,
    key: "606ab09bc5f4e158dd513db4ea10471d",
    scriptSrc: "https://drainalmost.com/606ab09bc5f4e158dd513db4ea10471d/invoke.js",
    width: 160,
    height: 300,
  },
  skyscraper: {
    type: "atOptions" as const,
    key: "3be5a437384b633b78c1d941e90216c0",
    scriptSrc: "https://drainalmost.com/3be5a437384b633b78c1d941e90216c0/invoke.js",
    width: 160,
    height: 600,
  },
};

export function AdBanner({ variant, className = "" }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !containerRef.current) return;
    loadedRef.current = true;

    const config = AD_CONFIG[variant];

    if (config.type === "container") {
      const container = document.createElement("div");
      container.id = config.containerId;
      containerRef.current.appendChild(container);

      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = config.scriptSrc;
      containerRef.current.appendChild(script);
    } else {
      const optionsScript = document.createElement("script");
      optionsScript.textContent = `atOptions = { 'key': '${config.key}', 'format': 'iframe', 'height': ${config.height}, 'width': ${config.width}, 'params': {} };`;
      containerRef.current.appendChild(optionsScript);

      const invokeScript = document.createElement("script");
      invokeScript.src = config.scriptSrc;
      containerRef.current.appendChild(invokeScript);
    }
  }, [variant]);

  return <div ref={containerRef} className={`flex justify-center ${className}`} />;
}
