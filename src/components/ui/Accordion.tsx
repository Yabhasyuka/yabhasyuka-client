"use client";

import React, { useState, useRef, useId } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Accordion({
  items,
  className,
}: {
  items: { question: string; answer: string }[];
  className?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const baseId = useId();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        contentRefs.current.forEach((el, idx) => {
          if (!el) return;
          if (idx === openIndex) {
            gsap.to(el, { height: "auto", duration: 0.6, ease: "power3.out" });
          } else {
            gsap.to(el, { height: 0, duration: 0.5, ease: "power3.out" });
          }
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        contentRefs.current.forEach((el, idx) => {
          if (!el) return;
          if (idx === openIndex) {
            el.style.height = "auto";
          } else {
            el.style.height = "0px";
          }
        });
      });
    },
    [openIndex]
  );

  return (
    <div className={`divide-y divide-ink/10 border-t border-b border-ink/10 ${className || ""}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const btnId = `${baseId}-btn-${index}`;
        const contentId = `${baseId}-content-${index}`;

        return (
          <div key={index} className="group">
            <button
              type="button"
              id={btnId}
              aria-expanded={isOpen}
              aria-controls={contentId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full py-6 flex items-center justify-between text-left cursor-pointer transition-colors hover:text-clay"
            >
              <span className="font-display text-lg text-ink group-hover:text-clay transition-colors pr-4">
                {item.question}
              </span>
              <div
                className={`relative w-4 h-4 flex items-center justify-center shrink-0 transition-transform duration-500 ease-out ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <span className="absolute w-4 h-[1.5px] bg-ink group-hover:bg-clay transition-colors" />
                <span
                  className={`absolute w-4 h-[1.5px] bg-ink group-hover:bg-clay transition-all duration-500 ease-out ${
                    isOpen ? "rotate-0 opacity-0" : "rotate-90 opacity-100"
                  }`}
                />
              </div>
            </button>
            <div
              id={contentId}
              role="region"
              aria-labelledby={btnId}
              ref={(el) => {
                contentRefs.current[index] = el;
              }}
              className="overflow-hidden h-0"
            >
              <div className="pb-6 text-ink-soft font-body text-base leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
