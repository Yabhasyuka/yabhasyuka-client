import React from "react";
import { Accordion } from "@/components/ui/Accordion";
import type { Faq } from "@/lib/api";

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  return (
    <section className="py-24 md:py-40 bg-bone-deep overflow-hidden">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-[1px] w-8 bg-ink/15" />
          <span className="text-xs uppercase tracking-[0.25em] text-ink-soft font-body">
            Before you arrive
          </span>
          <span className="h-[1px] w-8 bg-ink/15" />
        </div>

        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink text-center leading-tight mb-16">
          Good to know.
        </h2>

        <Accordion items={faqs} />
      </div>
    </section>
  );
}
