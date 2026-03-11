"use client";

import { useEffect, useRef } from "react";

interface FallingAnimationProps {
  animation: string;
  imageUrl?: string;
}

const BUILT_IN_EMOJIS: Record<string, string[]> = {
  confetti: ["🎊", "🎉", "✨", "🎈", "🎆"],
  snow: ["❄️", "❅", "❆", "✦", "·"],
  hearts: ["❤️", "💕", "💖", "💗", "💝"],
  stars: ["⭐", "✨", "🌟", "💫", "⚡"],
  leaves: ["🍂", "🍁", "🍃", "🌿", "☘️"],
  rain: ["💧", "💦", "🌧️"],
};

export function FallingAnimation({ animation, imageUrl }: FallingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animation === "none") return;
    const container = containerRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];
    const PARTICLE_COUNT = 20;

    function createParticle() {
      if (!container) return;
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.pointerEvents = "none";
      particle.style.zIndex = "1";

      const startX = Math.random() * 100;
      const duration = 4 + Math.random() * 6;
      const delay = Math.random() * 5;
      const size = 12 + Math.random() * 16;
      const drift = (Math.random() - 0.5) * 60;

      particle.style.left = `${startX}%`;
      particle.style.top = "-30px";
      particle.style.fontSize = `${size}px`;
      particle.style.opacity = "0.8";
      particle.style.animation = `fallDown ${duration}s linear ${delay}s infinite`;
      particle.style.setProperty("--drift", `${drift}px`);

      if (animation === "custom" && imageUrl) {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        img.style.objectFit = "contain";
        particle.appendChild(img);
      } else {
        const emojis = BUILT_IN_EMOJIS[animation] || BUILT_IN_EMOJIS.confetti;
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      }

      container.appendChild(particle);
      particles.push(particle);
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      createParticle();
    }

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, [animation, imageUrl]);

  if (animation === "none") return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fallDown {
            0% {
              transform: translateY(0) translateX(0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.8;
            }
            90% {
              opacity: 0.6;
            }
            100% {
              transform: translateY(calc(100vh + 30px)) translateX(var(--drift, 0px)) rotate(360deg);
              opacity: 0;
            }
          }
        `,
      }} />
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 1 }}
      />
    </>
  );
}
