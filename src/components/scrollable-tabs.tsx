"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ScrollableTabs({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      observer.disconnect();
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -120 : 120, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 flex h-8 w-7 items-center justify-center rounded-md bg-background/90 border shadow-sm backdrop-blur-sm hover:bg-muted transition-colors"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />
        {children}
      </div>
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 flex h-8 w-7 items-center justify-center rounded-md bg-background/90 border shadow-sm backdrop-blur-sm hover:bg-muted transition-colors"
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  );
}
