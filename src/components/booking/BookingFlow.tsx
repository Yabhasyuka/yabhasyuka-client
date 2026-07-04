"use client";

import React, { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { Service, BookingConfirmation } from "@/lib/api";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ServiceStep,
  ScheduleStep,
  DetailsStep,
  ConfirmStep,
} from "./steps";

export interface BookingState {
  step: 1 | 2 | 3 | 4;
  selectedService: Service | null;
  date: string;
  time: string;
  name: string;
  whatsapp: string;
  email: string;
  notes: string;
  confirmation: BookingConfirmation | null;
}

const STEPS = ["Ritual", "Schedule", "Details", "Confirmed"];

export function BookingFlow({ services }: { services: Service[] }) {
  const searchParams = useSearchParams();
  const [state, setState] = useState<BookingState>(() => {
    const paramSlug = searchParams?.get("service");
    const foundService = paramSlug
      ? services.find((s) => s.slug === paramSlug) || null
      : null;
    return {
      step: foundService ? 2 : 1,
      selectedService: foundService,
      date: "",
      time: "",
      name: "",
      whatsapp: "",
      email: "",
      notes: "",
      confirmation: null,
    };
  });

  const stepContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".step-content",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
        );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".step-content", { opacity: 1, y: 0 });
      });
    },
    { scope: stepContainerRef, dependencies: [state.step] }
  );

  const handleBack = () => {
    setState((prev) => ({
      ...prev,
      step: Math.max(1, prev.step - 1) as 1 | 2 | 3 | 4,
    }));
  };

  return (
    <div className="w-full">
      {/* Shared chrome: quiet progress rail */}
      <div className="mb-12">
        <div className="relative mb-4">
          <div className="absolute top-0 left-0 w-full h-px bg-ink/10" />
          <div
            className="absolute top-0 left-0 h-px bg-clay transition-all duration-700 ease-[var(--ease-breath)]"
            style={{ width: `${((state.step - 1) / 3) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs uppercase tracking-[0.2em] font-body">
          {STEPS.map((label, index) => {
            const stepNum = index + 1;
            const isCurrent = state.step === stepNum;
            return (
              <span
                key={label}
                className={`transition-colors duration-300 ${
                  isCurrent ? "text-ink font-medium" : "text-ink-soft/50"
                }`}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Back link where applicable */}
      {state.step > 1 && state.step < 4 && (
        <div className="mb-6">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center text-sm text-ink-soft hover:text-ink transition-colors cursor-pointer font-body focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Step content with GSAP transition */}
      <div ref={stepContainerRef}>
        <div key={state.step} className="step-content">
          {state.step === 1 && (
            <ServiceStep
              services={services}
              selectedService={state.selectedService}
              onSelectService={(service) =>
                setState((prev) => ({ ...prev, selectedService: service }))
              }
              onContinue={() => setState((prev) => ({ ...prev, step: 2 }))}
            />
          )}
          {state.step === 2 && state.selectedService && (
            <ScheduleStep
              selectedService={state.selectedService}
              date={state.date}
              time={state.time}
              onSelectDate={(date) =>
                setState((prev) => ({ ...prev, date, time: "" }))
              }
              onSelectTime={(time) => setState((prev) => ({ ...prev, time }))}
              onChangeService={() => setState((prev) => ({ ...prev, step: 1 }))}
              onContinue={() => setState((prev) => ({ ...prev, step: 3 }))}
            />
          )}
          {state.step === 3 && state.selectedService && (
            <DetailsStep
              selectedService={state.selectedService}
              date={state.date}
              time={state.time}
              name={state.name}
              whatsapp={state.whatsapp}
              email={state.email}
              notes={state.notes}
              onChangeField={(field, value) =>
                setState((prev) => ({ ...prev, [field]: value }))
              }
              onSuccess={(confirmation) =>
                setState((prev) => ({ ...prev, confirmation, step: 4 }))
              }
            />
          )}
          {state.step === 4 && state.confirmation && (
            <ConfirmStep confirmation={state.confirmation} />
          )}
        </div>
      </div>
    </div>
  );
}
