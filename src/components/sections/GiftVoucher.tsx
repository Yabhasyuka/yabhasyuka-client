import React from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TransitionLink } from "@/components/ui/TransitionLink";

export function GiftVoucher() {
  return (
    <section className="py-24 md:py-36 bg-bone-deep overflow-hidden flex items-center justify-center min-h-[35svh]">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12 text-center flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-[1px] w-8 bg-ink/15" />
          <span className="text-xs uppercase tracking-[0.25em] text-ink-soft font-body">
            Gifting
          </span>
          <span className="h-[1px] w-8 bg-ink/15" />
        </div>

        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink max-w-4xl leading-[1.15] mb-6">
          Give someone an hour that belongs only to them.
        </h2>

        <p className="text-ink-soft text-base md:text-lg max-w-xl mb-12 font-body leading-relaxed">
          Gift vouchers for every ritual — available at the spa, online soon.
        </p>

        <MagneticButton className="bg-ink text-bone rounded-full hover:bg-clay transition-colors duration-300 shadow-sm">
          <TransitionLink
            href="/#contact"
            className="px-8 py-4 inline-block text-sm tracking-[0.15em] uppercase font-medium font-body"
          >
            Enquire about vouchers
          </TransitionLink>
        </MagneticButton>
      </div>
    </section>
  );
}
