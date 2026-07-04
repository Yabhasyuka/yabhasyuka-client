import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { getServices, getSiteInfo } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
import { RevealText } from "@/components/ui/RevealText";
import { TransitionLink } from "@/components/ui/TransitionLink";

export const metadata: Metadata = {
  title: "Rituals & Treatments — Yabhasyuka",
  description:
    "Explore our elevated beauty wellness rituals in Denpasar, Bali. Relaxation, sculpting, and refined aesthetic care.",
};

function formatPrice(price: number): string {
  if (price >= 1000000) {
    const millions = price / 1000000;
    const formatted = parseFloat(millions.toFixed(2));
    return `IDR ${formatted}M`;
  } else {
    const thousands = Math.round(price / 1000);
    return `IDR ${thousands}K`;
  }
}

export default async function ServicesPage() {
  const [services, site] = await Promise.all([getServices(), getSiteInfo()]);

  const pillars = [
    {
      id: "relaxation" as const,
      name: "Relaxation",
      description: "Therapies to quiet the nervous system, release physical tension, and cultivate deep ease.",
    },
    {
      id: "sculpting" as const,
      name: "Sculpting — face · head · body",
      description: "Precise manual techniques designed to contour, lift, and restore structural alignment.",
    },
    {
      id: "aesthetic" as const,
      name: "Aesthetic",
      description: "Advanced botanical treatments focused on resurfacing, deep hydration, and cellular radiance.",
    },
  ];

  return (
    <div className="bg-bone min-h-screen flex flex-col font-body text-ink selection:bg-clay/20 selection:text-ink">
      <Navbar />

      <main className="flex-grow pt-40 pb-24 md:pb-32">
        <section className="mx-auto max-w-[90rem] px-6 md:px-12">
          {/* Header Block */}
          <div className="mb-20 md:mb-28">
            <span className="text-xs uppercase tracking-[0.25em] text-ink-soft block mb-3 font-body font-semibold">
              Treatments
            </span>
            <RevealText
              as="h1"
              className="font-display text-5xl md:text-6xl text-ink leading-[1.1] max-w-4xl"
            >
              Every ritual, in one place.
            </RevealText>
          </div>

          {/* Pillars List */}
          <div className="flex flex-col gap-24 md:gap-32">
            {pillars.map((pillar) => {
              const pillarServices = services.filter((s) => s.pillar === pillar.id);

              return (
                <div key={pillar.id} className="flex flex-col">
                  {/* Pillar Header */}
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-6">
                    <h2 className="font-display text-3xl md:text-4xl text-ink">
                      {pillar.name}
                    </h2>
                    <p className="text-ink-soft text-sm md:text-base max-w-xl font-body leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Hairline Rule */}
                  <hr className="border-t border-ink/10" />

                  {/* Services Rows */}
                  <div className="flex flex-col">
                    {pillarServices.map((service) => (
                      <TransitionLink
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="group grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-center py-8 border-b border-ink/10"
                      >
                        {/* Service Image */}
                        <div className="relative aspect-[4/3] w-full md:w-72 overflow-hidden bg-linen border border-ink/5">
                          <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 288px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>

                        {/* Service Details */}
                        <div className="flex flex-col gap-2">
                          <h3 className="font-display text-2xl md:text-3xl text-ink transition-transform duration-300 group-hover:translate-x-2">
                            {service.name}
                          </h3>
                          <p className="text-ink-soft text-sm md:text-base leading-relaxed max-w-2xl font-body">
                            {service.tagline}
                          </p>
                        </div>

                        {/* Meta Info */}
                        <div className="flex md:flex-col md:items-end justify-between items-center md:justify-center gap-1 md:text-right text-xs uppercase tracking-widest text-ink-soft font-body font-medium">
                          <span>{service.durationMinutes} min</span>
                          <span className="text-ink font-semibold mt-1">
                            {formatPrice(service.priceIdr)}
                          </span>
                        </div>
                      </TransitionLink>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer
        instagramUrl={site.instagramUrl}
        whatsappUrl={site.whatsappUrl}
        email={site.email}
        address={site.address}
        city={site.city}
      />
      <WhatsAppFab href={site.whatsappUrl} />
    </div>
  );
}
