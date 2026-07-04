"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export function RevealText({
  children,
  as = "div",
  className,
  delay = 0,
  y = 48,
}: {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const containerRef = useRef<any>(null);
  const Component = as as any;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let split: SplitText | null = null;
        let isReverted = false;

        const initAnimation = () => {
          if (isReverted || !containerRef.current) return;

          try {
            split = new SplitText(containerRef.current, {
              type: "lines",
              mask: "lines",
            });
          } catch (e) {
            console.warn("SplitText initialization failed:", e);
          }

          const targets =
            split && split.lines && split.lines.length > 0
              ? split.lines
              : containerRef.current.children.length > 0
              ? containerRef.current.children
              : containerRef.current;

          gsap.from(targets, {
            yPercent: 110,
            y: y,
            duration: 1.1,
            stagger: 0.09,
            ease: "expo.out",
            delay: delay,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              once: true,
            },
          });
        };

        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(initAnimation);
        } else {
          initAnimation();
        }

        return () => {
          isReverted = true;
          if (split) {
            split.revert();
          }
        };
      });
    },
    { scope: containerRef }
  );

  return (
    <Component ref={containerRef} className={className}>
      {children}
    </Component>
  );
}
