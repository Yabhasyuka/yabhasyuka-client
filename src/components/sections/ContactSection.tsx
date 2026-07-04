import React from "react";
import { RevealText } from "@/components/ui/RevealText";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { SiteInfo } from "@/lib/api";

export function ContactSection({ site }: { site: SiteInfo }) {
  return (
    <section id="contact" className="py-24 md:py-40 bg-bone overflow-hidden">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12 text-center flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="h-[1px] w-8 bg-ink/15" />
          <span className="text-xs uppercase tracking-[0.25em] text-ink-soft font-body">
            Reservation
          </span>
          <span className="h-[1px] w-8 bg-ink/15" />
        </div>

        <RevealText className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-ink leading-[1.05] mb-12 max-w-5xl">
          Begin your ritual.
        </RevealText>

        <div className="flex flex-wrap items-center justify-center gap-6 mb-20">
          <TransitionLink
            href="/booking"
            className="bg-ink text-bone rounded-full px-8 py-4 hover:bg-clay transition-colors duration-300 inline-flex items-center justify-center text-sm font-medium tracking-[0.15em] uppercase font-body shadow-sm"
          >
            Book online
          </TransitionLink>

          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-ink/20 hover:border-ink rounded-full px-8 py-4 text-ink hover:bg-ink hover:text-bone transition-all duration-300 inline-flex items-center justify-center text-sm font-medium tracking-[0.15em] uppercase font-body"
          >
            WhatsApp us
          </a>
        </div>

        <div className="pt-12 border-t border-ink/10 flex flex-wrap items-center justify-center gap-8 text-xs uppercase tracking-[0.25em] text-ink-soft font-body">
          <a
            href={`mailto:${site.email}`}
            className="hover:text-clay transition-colors duration-300"
          >
            {site.email}
          </a>
          <span className="h-[1px] w-4 bg-ink/20 hidden sm:inline-block" />
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-clay transition-colors duration-300 inline-flex items-center gap-1.5"
          >
            <span>{site.instagram}</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
