import React from "react";
import { RevealText } from "@/components/ui/RevealText";
import { ParallaxImage } from "@/components/ui/ParallaxImage";

export function About() {
  return (
    <section id="about" className="py-24 md:py-40 bg-bone overflow-hidden">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left sticky editorial column */}
          <div className="lg:col-span-5 lg:sticky lg:top-36">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs uppercase tracking-[0.25em] text-ink-soft font-body">
                About
              </span>
              <span className="h-[1px] w-12 bg-ink/15" />
            </div>
            <RevealText className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.15] text-ink">
              One address. Three floors of quiet transformation.
            </RevealText>
          </div>

          {/* Right column: copy & staggered parallax images */}
          <div className="lg:col-span-7 flex flex-col gap-8 text-ink-soft leading-relaxed font-body text-base md:text-lg">
            <p>
              On the ground floor, our clinical and medical aesthetic suite offers advanced, non-invasive skin refinement. Here, precision diagnostics and professional-grade treatments are seamlessly woven into holistic care plans, ensuring real results without sacrificing serenity.
            </p>
            <p>
              Ascending to the second and third floors reveals our spa sanctuary—a quiet realm dedicated to deep sensory deceleration. From Balinese signature touches to specialized sculpting rituals for face, head, and body, every treatment is an unhurried invitation to restore your natural rhythm.
            </p>

            {/* Staggered Parallax Images */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 md:gap-8 pt-8 items-start">
              <div className="sm:col-span-7">
                <ParallaxImage
                  src="/images/about-1.webp"
                  alt="Yabhasyuka clinic and aesthetic space"
                  className="w-full aspect-[3/4] bg-bone-deep"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  speed={0.15}
                />
              </div>
              <div className="sm:col-span-5 sm:mt-20">
                <ParallaxImage
                  src="/images/about-2.webp"
                  alt="Yabhasyuka spa sanctuary treatment room"
                  className="w-full aspect-[4/3] bg-bone-deep"
                  sizes="(max-width: 768px) 100vw, 30vw"
                  speed={0.1}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Three pillars footer list */}
        <div className="mt-24 md:mt-36 pt-16 border-t border-ink/10 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-2xl md:text-3xl text-ink tracking-wide">
              Relaxation
            </h3>
            <span className="h-[1px] w-8 bg-clay my-1" />
            <p className="text-ink-soft text-sm md:text-base leading-relaxed font-body">
              Deep sensory restoration through Balinese touch, warm stone therapies, and herbal compresses designed to quiet the nervous system and release held tension.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-display text-2xl md:text-3xl text-ink tracking-wide">
              Sculpting
            </h3>
            <span className="h-[1px] w-8 bg-clay my-1" />
            <p className="text-ink-soft text-sm md:text-base leading-relaxed font-body">
              Targeted contouring rituals for face, head, and body that stimulate lymphatic drainage, relieve deep muscular fatigue, and elevate natural definition.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-display text-2xl md:text-3xl text-ink tracking-wide">
              Aesthetic
            </h3>
            <span className="h-[1px] w-8 bg-clay my-1" />
            <p className="text-ink-soft text-sm md:text-base leading-relaxed font-body">
              Refined, non-invasive clinical treatments administered with professional precision to revitalize skin texture, restore cellular luminosity, and renew vitality.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
