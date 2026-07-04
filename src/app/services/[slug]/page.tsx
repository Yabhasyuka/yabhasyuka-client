import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { getService, getServices, getSiteInfo } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
import { RevealText } from "@/components/ui/RevealText";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ParallaxImage } from "@/components/ui/ParallaxImage";

export const dynamicParams = false;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) {
    return {
      title: "Ritual Not Found — Yabhasyuka",
    };
  }
  return {
    title: `${service.name} — Yabhasyuka`,
    description: service.tagline,
  };
}

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

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [service, allServices, site] = await Promise.all([
    getService(slug),
    getServices(),
    getSiteInfo(),
  ]);

  if (!service) {
    notFound();
  }

  // Find 3 other recommended services (prioritize same pillar first)
  const otherServices = allServices.filter((s) => s.slug !== service.slug);
  const recommendedServices = [...otherServices]
    .sort((a, b) => {
      if (a.pillar === service.pillar && b.pillar !== service.pillar) return -1;
      if (a.pillar !== service.pillar && b.pillar === service.pillar) return 1;
      return 0;
    })
    .slice(0, 3);

  // Capitalize pillar name for eyebrow
  const capitalizedPillar = service.pillar.charAt(0).toUpperCase() + service.pillar.slice(1);

  // WhatsApp pre-filled message url
  const whatsappUrl = `${site.whatsappUrl}?text=${encodeURIComponent(
    `Hello Yabhasyuka, I would like to ask about the "${service.name}" treatment.`
  )}`;

  return (
    <div className="bg-bone min-h-screen flex flex-col font-body text-ink selection:bg-clay/20 selection:text-ink">
      <Navbar />

      <main className="flex-grow">
        {/* Full-bleed Hero Section */}
        <div className="relative w-full h-[70svh] overflow-hidden bg-linen">
          <ParallaxImage
            src={service.image}
            alt={service.name}
            className="w-full h-full"
            priority
            sizes="100vw"
          />
          {/* Bone Gradient Overlay at the bottom */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bone via-bone/60 to-transparent pointer-events-none" />
        </div>

        {/* Title Block (Overlapping Hero bottom) */}
        <div className="relative z-10 -mt-20 md:-mt-28 mb-16 md:mb-24">
          <div className="mx-auto max-w-[90rem] px-6 md:px-12">
            <span className="text-xs uppercase tracking-[0.25em] text-ink-soft block mb-3 font-body font-semibold">
              {capitalizedPillar}
            </span>
            <RevealText
              as="h1"
              className="font-display text-ink leading-[1.05] mb-5"
            >
              <span
                style={{ fontSize: "clamp(3.5rem, 8vw, 5.5rem)", display: "block" }}
                className="tracking-tight"
              >
                {service.name}
              </span>
            </RevealText>
            <p className="text-ink-soft text-lg md:text-xl font-body max-w-3xl leading-relaxed">
              {service.tagline}
            </p>
          </div>
        </div>

        {/* Main Content Body */}
        <section className="mx-auto max-w-[90rem] px-6 md:px-12 pb-24 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-24 items-start">
            {/* Left Column: Description & Benefits */}
            <div className="flex flex-col">
              <div className="font-body text-base md:text-lg text-ink-soft leading-relaxed max-w-prose space-y-6">
                <p>{service.description}</p>
              </div>

              {/* Benefits list */}
              <div className="mt-16">
                <h2 className="font-display text-2xl text-ink mb-6">
                  What it does
                </h2>
                <div className="flex flex-col border-t border-ink/10">
                  {service.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="py-4 border-b border-ink/10 text-ink-soft font-body text-sm md:text-base leading-relaxed"
                    >
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Booking Card */}
            <div className="lg:sticky lg:top-32 w-full">
              <div className="bg-linen p-8 border border-ink/5 flex flex-col gap-6">
                <div className="flex flex-col gap-3 pb-6 border-b border-ink/10">
                  <span className="text-[10px] uppercase tracking-widest text-ink-soft font-semibold font-body">
                    Ritual Details
                  </span>
                  
                  <div className="flex justify-between items-baseline mt-2">
                    <span className="text-xs uppercase tracking-wider text-ink-soft">Duration</span>
                    <span className="font-display text-lg text-ink">{service.durationMinutes} min</span>
                  </div>
                  
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs uppercase tracking-wider text-ink-soft">Value</span>
                    <span className="font-display text-2xl text-ink font-semibold">
                      {formatPrice(service.priceIdr)}
                    </span>
                  </div>
                </div>

                <TransitionLink
                  href={`/booking?service=${service.slug}`}
                  className="bg-ink text-bone rounded-full px-7 py-3.5 hover:bg-clay transition-colors block text-center font-body text-sm font-medium transition-all duration-300"
                >
                  Book this treatment
                </TransitionLink>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-center text-ink-soft hover:text-ink underline transition-colors block font-medium"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* More Rituals Section */}
        <section className="border-t border-ink/10 mx-auto max-w-[90rem] px-6 md:px-12 py-24 md:py-32">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-ink-soft block mb-3 font-body font-semibold">
              Recommendations
            </span>
            <h3 className="font-display text-3xl md:text-4xl text-ink">
              More rituals
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {recommendedServices.map((rec) => (
              <TransitionLink
                key={rec.slug}
                href={`/services/${rec.slug}`}
                className="group flex flex-col gap-4"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-linen border border-ink/5">
                  <Image
                    src={rec.image}
                    alt={rec.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h4 className="font-display text-xl text-ink transition-colors duration-300 group-hover:text-clay">
                  {rec.name}
                </h4>
              </TransitionLink>
            ))}
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
