"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import HeroScene from "@/components/three/HeroScene";

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(
          ".hero-eyebrow",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.1
        )
          .fromTo(
            ".hero-line",
            { yPercent: 110 },
            { yPercent: 0, duration: 1.1, stagger: 0.15 },
            0.2
          )
          .fromTo(
            ".hero-sub",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8 },
            0.5
          )
          .fromTo(
            ".hero-ctas",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8 },
            0.6
          )
          .fromTo(
            ".hero-scroll",
            { opacity: 0 },
            { opacity: 1, duration: 0.8 },
            0.8
          );
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] w-full overflow-hidden bg-bone flex flex-col justify-between pt-28 pb-10 md:pb-14"
    >
      {/* Background radial warm glow */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[700px] h-[500px] md:h-[700px] bg-clay/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Static fallback image for HeroScene */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[60%] opacity-25 pointer-events-none overflow-hidden">
        <Image
          src="/images/hero-fallback.webp"
          alt="Sculptural silk form"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bone via-bone/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-bone via-transparent to-bone/30" />
      </div>

      {/* WebGL Hero Scene */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[60%] opacity-45 lg:opacity-85 pointer-events-none">
        <HeroScene className="w-full h-full" />
      </div>

      {/* Foreground content */}
      <div className="mx-auto max-w-[90rem] px-6 md:px-12 w-full relative z-10 my-auto py-12">
        <div className="max-w-3xl">
          <div className="hero-eyebrow flex items-center gap-3 mb-6">
            <span className="text-xs uppercase tracking-[0.25em] text-ink-soft font-body">
              Denpasar · Bali — Beauty Wellness Spa
            </span>
            <span className="h-[1px] w-10 bg-ink/15 hidden sm:inline-block" />
          </div>

          <h1 className="font-display text-[clamp(3rem,6.5vw+1rem,6.5rem)] leading-[1.05] tracking-tight text-ink mb-8">
            <span className="block overflow-hidden py-0.5">
              <span className="hero-line block">The art of</span>
            </span>
            <span className="block overflow-hidden py-0.5">
              <span className="hero-line block">
                sculpted <em className="italic font-normal text-clay">calm.</em>
              </span>
            </span>
          </h1>

          <p className="hero-sub max-w-md text-ink-soft text-base md:text-lg leading-relaxed mb-10 font-body">
            An elevated sanctuary in Denpasar blending deep relaxation, sculpting rituals, and refined aesthetic care across three tranquil floors.
          </p>

          <div className="hero-ctas flex flex-wrap items-center gap-6">
            <TransitionLink
              href="/booking"
              className="bg-ink text-bone rounded-full px-7 py-3.5 hover:bg-clay transition-colors duration-300 inline-flex items-center justify-center font-medium text-sm tracking-wide shadow-sm"
            >
              Book a Ritual
            </TransitionLink>
            <TransitionLink
              href="/#services"
              className="text-ink-soft hover:text-ink transition-colors duration-300 text-sm tracking-wide py-3.5 inline-flex items-center gap-2 group"
            >
              <span>Explore treatments ↓</span>
            </TransitionLink>
          </div>
        </div>
      </div>

      {/* Bottom scroll cue */}
      <div className="hero-scroll mx-auto max-w-[90rem] px-6 md:px-12 w-full relative z-10 flex items-center gap-3 text-ink-soft text-xs tracking-[0.25em] uppercase mt-auto pt-6">
        <span>Scroll</span>
        <div className="h-[1px] w-12 bg-ink/20 overflow-hidden relative">
          <div className="absolute inset-0 bg-clay animate-pulse" />
        </div>
      </div>
    </section>
  );
}
