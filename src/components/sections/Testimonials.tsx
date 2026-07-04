"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Testimonial } from "@/lib/api";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!marqueeRef.current) return;
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          repeat: -1,
          duration: 45,
          ease: "none",
        });
      });
    },
    { scope: marqueeRef, dependencies: [testimonials] }
  );

  if (!testimonials || testimonials.length === 0) return null;

  const repeated = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-24 md:py-40 bg-ink text-bone overflow-hidden">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12 mb-16 md:mb-24">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs uppercase tracking-[0.25em] text-bone/50 font-body">
            Kind words
          </span>
          <span className="h-[1px] w-12 bg-bone/15" />
        </div>
      </div>

      <div className="flex whitespace-nowrap overflow-hidden">
        <div ref={marqueeRef} className="flex items-stretch gap-8 md:gap-12 w-max px-6 md:px-12">
          {repeated.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="w-[340px] sm:w-[440px] md:w-[540px] shrink-0 p-8 md:p-14 border border-bone/10 bg-bone/[0.02] flex flex-col justify-between whitespace-normal rounded-none"
            >
              <div>
                <span className="font-display text-4xl text-clay/60 block mb-6">“</span>
                <p className="font-display text-xl sm:text-2xl md:text-3xl leading-relaxed text-bone mb-10 font-normal">
                  {item.quote}
                </p>
              </div>
              <div className="pt-6 border-t border-bone/10 flex items-center justify-between text-xs tracking-[0.2em] uppercase font-body">
                <span className="text-bone font-medium">{item.name}</span>
                <span className="text-bone/60">{item.treatment}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
