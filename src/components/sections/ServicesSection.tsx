"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RevealText } from "@/components/ui/RevealText";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { Service, ServicePillar } from "@/lib/api";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function formatIdr(price: number): string {
  const inThousands = Math.round(price / 1000);
  return `IDR ${inThousands}K`;
}

export function ServicesSection({ services }: { services: Service[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".service-card").forEach((card) => {
          gsap.fromTo(
            card,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                once: true,
              },
            }
          );
        });
      });
    },
    { scope: sectionRef, dependencies: [services] }
  );

  const pillars: { id: ServicePillar; label: string; description: string }[] = [
    {
      id: "relaxation",
      label: "Relaxation",
      description: "Deep restorative bodywork and Balinese sensory deceleration.",
    },
    {
      id: "sculpting",
      label: "Sculpting",
      description: "Targeted contouring rituals and stimulating lymphatic flow.",
    },
    {
      id: "aesthetic",
      label: "Aesthetic",
      description: "Refined clinical care for skin luminosity and renewal.",
    },
  ];

  return (
    <section id="services" ref={sectionRef} className="py-24 md:py-40 bg-bone-deep overflow-hidden">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-20 md:mb-28">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs uppercase tracking-[0.25em] text-ink-soft font-body">
              Treatments
            </span>
            <span className="h-[1px] w-12 bg-ink/15" />
          </div>
          <RevealText className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-tight max-w-3xl">
            Rituals for face, head & body.
          </RevealText>
        </div>

        {/* Pillars & Services Grid */}
        <div className="space-y-24 md:space-y-36">
          {pillars.map((pillar) => {
            const pillarServices = services.filter((s) => s.pillar === pillar.id);
            if (pillarServices.length === 0) return null;

            return (
              <div key={pillar.id} className="pillar-group">
                {/* Pillar Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-5 border-b border-ink/15 gap-4">
                  <h3 className="font-display text-3xl md:text-4xl text-ink tracking-wide">
                    {pillar.label}
                  </h3>
                  <p className="text-ink-soft text-sm md:text-base font-body max-w-md">
                    {pillar.description}
                  </p>
                </div>

                {/* Editorial Asymmetric Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-6 md:pb-16">
                  {pillarServices.map((service, idx) => (
                    <div
                      key={service.slug}
                      className={`service-card transition-all duration-500 ${
                        idx % 3 === 1
                          ? "md:translate-y-12"
                          : idx % 3 === 2
                          ? "md:translate-y-24"
                          : ""
                      }`}
                    >
                      <TransitionLink
                        href={`/services/${service.slug}`}
                        className="group block h-full flex flex-col justify-between"
                      >
                        <div>
                          {/* Card Image Frame */}
                          <div className="relative aspect-[4/5] w-full overflow-hidden bg-bone mb-6">
                            <Image
                              src={service.image}
                              alt={service.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-500" />
                          </div>

                          {/* Name & Tagline */}
                          <h4 className="font-display text-2xl text-ink group-hover:text-clay transition-colors duration-300 mb-2">
                            {service.name}
                          </h4>
                          <p className="text-ink-soft text-sm leading-relaxed font-body line-clamp-2">
                            {service.tagline}
                          </p>
                        </div>

                        {/* Duration + Price Row */}
                        <div className="text-xs tracking-[0.2em] uppercase mt-6 pt-4 border-t border-ink/10 flex items-center justify-between text-ink-soft font-body">
                          <span>{service.durationMinutes} MINS</span>
                          <span className="text-ink font-medium">
                            {formatIdr(service.priceIdr)}
                          </span>
                        </div>
                      </TransitionLink>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Link */}
        <div className="mt-24 md:mt-36 text-center flex justify-center">
          <TransitionLink
            href="/services"
            className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-ink hover:text-clay transition-colors py-4 px-8 border border-ink/20 hover:border-clay rounded-full"
          >
            <span>View all treatments</span>
            <span>→</span>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
