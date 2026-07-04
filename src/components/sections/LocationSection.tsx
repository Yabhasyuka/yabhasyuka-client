import React from "react";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import type { SiteInfo } from "@/lib/api";

export function LocationSection({ site }: { site: SiteInfo }) {
  return (
    <section id="location" className="py-24 md:py-40 bg-bone overflow-hidden">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Info & Hours */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs uppercase tracking-[0.25em] text-ink-soft font-body">
                  Find us
                </span>
                <span className="h-[1px] w-12 bg-ink/15" />
              </div>

              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-tight mb-8">
                In the heart of Denpasar.
              </h2>

              <div className="text-ink-soft text-base md:text-lg leading-relaxed mb-10 font-body">
                <p className="font-medium text-ink mb-1">{site.address}</p>
                <p>{site.city}</p>
              </div>

              <div className="space-y-4 border-t border-ink/15 pt-8 mb-12">
                {site.hours.map((h, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm md:text-base text-ink-soft font-body"
                  >
                    <span className="font-medium text-ink">{h.days}</span>
                    <span>
                      {h.open} – {h.close}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-ink hover:text-clay transition-colors py-4 px-8 border border-ink/20 hover:border-clay rounded-full font-body"
              >
                <span>Chat on WhatsApp</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Right Column: Map & Caption */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-bone-deep mb-6 border border-ink/5">
              <iframe
                src={site.mapEmbedUrl}
                title="Map to Yabhasyuka"
                loading="lazy"
                className="absolute inset-0 w-full h-full border-0 filter grayscale-[0.4] sepia-[0.15] contrast-[0.9]"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-4">
              <div className="w-40 sm:w-48 shrink-0">
                <ParallaxImage
                  src="/images/location.webp"
                  alt="Yabhasyuka spa exterior in Denpasar"
                  className="w-full aspect-[3/2] bg-bone-deep border border-ink/5"
                  sizes="200px"
                  speed={0.08}
                />
              </div>
              <p className="text-xs sm:text-sm text-ink-soft italic font-display leading-relaxed">
                A quiet sanctuary situated across three tranquil floors, easily reachable from Sanur, Seminyak, and Ubud.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
