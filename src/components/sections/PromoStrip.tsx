"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { Promo } from "@/lib/api";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function PromoStrip({ promos }: { promos: Promo[] }) {
  const stripRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!stripRef.current) return;
        gsap.to(stripRef.current, {
          xPercent: -50,
          repeat: -1,
          duration: 30,
          ease: "none",
        });
      });
    },
    { scope: stripRef, dependencies: [promos] }
  );

  if (!promos || promos.length === 0) return null;

  // Repeat enough times for wide screen seamless looping
  const repeatedPromos = [...promos, ...promos, ...promos, ...promos];

  return (
    <TransitionLink
      href="/promo"
      className="block bg-clay/15 border-y border-clay/25 overflow-hidden py-3 hover:bg-clay/20 transition-colors"
    >
      <div ref={stripRef} className="flex whitespace-nowrap items-center gap-8 w-max">
        {repeatedPromos.map((promo, idx) => (
          <span
            key={`${promo.id}-${idx}`}
            className="text-ink text-sm tracking-wide inline-flex items-center gap-3 font-body"
          >
            <span className="text-clay text-xs">✳</span>
            <span className="font-medium">{promo.title}</span>
            <span>—</span>
            <span>{promo.discountLabel}</span>
            <span className="text-ink-soft">·</span>
            <span className="text-ink-soft">valid until {formatDate(promo.validUntil)}</span>
            <span className="text-clay/60 ml-3">—</span>
          </span>
        ))}
      </div>
    </TransitionLink>
  );
}
