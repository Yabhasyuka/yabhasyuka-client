"use client";

import React, { useState, useEffect, useRef } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  getAvailableSlots,
  createBooking,
  getSiteInfo,
  type Service,
  type ServicePillar,
  type TimeSlot,
  type BookingConfirmation,
} from "@/lib/api";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function formatPrice(priceIdr: number): string {
  if (priceIdr >= 1_000_000) {
    const millions = priceIdr / 1_000_000;
    const formatted = Number.isInteger(millions)
      ? millions.toString()
      : millions.toFixed(2).replace(/\.?0+$/, "");
    return `IDR ${formatted}M`;
  } else {
    const thousands = Math.round(priceIdr / 1_000);
    return `IDR ${thousands}K`;
  }
}

export function formatYmd(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const d = new Date(year, month, day);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface ServiceStepProps {
  services: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
  onContinue: () => void;
}

const PILLAR_LABELS: Record<ServicePillar, string> = {
  relaxation: "Relaxation Rituals",
  sculpting: "Sculpting & Contour",
  aesthetic: "Aesthetic Treatments",
};

const PILLAR_ORDER: ServicePillar[] = ["relaxation", "sculpting", "aesthetic"];

export function ServiceStep({
  services,
  selectedService,
  onSelectService,
  onContinue,
}: ServiceStepProps) {
  return (
    <div>
      <div role="radiogroup" aria-label="Select a ritual" className="space-y-10">
        {PILLAR_ORDER.map((pillar) => {
          const pillarServices = services.filter((s) => s.pillar === pillar);
          if (pillarServices.length === 0) return null;

          return (
            <div key={pillar}>
              <div className="text-xs uppercase tracking-[0.2em] text-clay mb-4 font-body font-medium">
                {PILLAR_LABELS[pillar]}
              </div>
              <div className="border border-ink/10 rounded-lg overflow-hidden bg-bone/40 divide-y divide-ink/5">
                {pillarServices.map((service) => {
                  const isSelected = selectedService?.slug === service.slug;
                  return (
                    <button
                      key={service.slug}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => onSelectService(service)}
                      className={`w-full text-left p-5 md:p-6 transition-all duration-300 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay block ${
                        isSelected
                          ? "bg-linen border-l-2 border-clay pl-5 md:pl-6"
                          : "hover:bg-linen/60 border-l-2 border-transparent"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                        <div>
                          <h3 className="font-display text-xl text-ink">
                            {service.name}
                          </h3>
                          <p className="text-sm text-ink-soft mt-1 font-body">
                            {service.tagline}
                          </p>
                        </div>
                        <div className="text-xs uppercase tracking-widest text-ink-soft shrink-0 sm:text-right font-body pt-1 sm:pt-0">
                          <span>{service.durationMinutes} mins</span>
                          <span className="mx-2">·</span>
                          <span>{formatPrice(service.priceIdr)}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-end">
        <button
          type="button"
          disabled={!selectedService}
          onClick={onContinue}
          className="bg-ink text-bone rounded-full px-8 py-3.5 hover:bg-clay transition-colors disabled:opacity-40 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay cursor-pointer font-body text-sm tracking-wide"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

interface ScheduleStepProps {
  selectedService: Service;
  date: string;
  time: string;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onChangeService: () => void;
  onContinue: () => void;
}

export function ScheduleStep({
  selectedService,
  date,
  time,
  onSelectDate,
  onSelectTime,
  onChangeService,
  onContinue,
}: ScheduleStepProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const minDate = formatYmd(today);
  const maxDateObj = new Date(today);
  maxDateObj.setDate(maxDateObj.getDate() + 60);
  const maxDate = formatYmd(maxDateObj);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    getAvailableSlots(selectedService.slug, date)
      .then((res) => {
        if (!cancelled) {
          setSlots(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load time slots"
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [date, selectedService.slug]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    onSelectDate(newDate);
  };

  return (
    <div>
      <div className="bg-linen border border-ink/5 p-5 rounded-lg mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-ink-soft block mb-1 font-body">
            Selected Ritual
          </span>
          <h3 className="font-display text-xl text-ink">
            {selectedService.name}
          </h3>
          <p className="text-xs uppercase tracking-widest text-ink-soft mt-1 font-body">
            {selectedService.durationMinutes} mins ·{" "}
            {formatPrice(selectedService.priceIdr)}
          </p>
        </div>
        <button
          type="button"
          onClick={onChangeService}
          className="text-sm text-clay hover:text-clay-deep underline underline-offset-4 transition-colors shrink-0 font-body cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay self-start sm:self-center"
        >
          Change
        </button>
      </div>

      <div className="space-y-8">
        <div>
          <label
            htmlFor="booking-date"
            className="block text-xs uppercase tracking-[0.2em] text-ink-soft mb-2 font-body font-medium"
          >
            Select Date
          </label>
          <input
            id="booking-date"
            type="date"
            min={minDate}
            max={maxDate}
            value={date}
            onChange={handleDateChange}
            className="bg-transparent border-b border-ink/20 focus:border-clay outline-none py-3 font-body [color-scheme:light] w-full max-w-xs text-ink cursor-pointer"
          />
        </div>

        <div>
          <span className="block text-xs uppercase tracking-[0.2em] text-ink-soft mb-4 font-body font-medium">
            Select Time
          </span>

          {loading && (
            <div className="flex flex-wrap gap-3 py-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-24 h-10 bg-bone-deep rounded-full animate-pulse"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <div
              className="bg-bone-deep border border-ink/10 p-4 text-sm text-[#a04c2e] rounded-lg"
              role="alert"
            >
              {error}
            </div>
          )}

          {!loading && !error && !date && (
            <p className="text-sm text-ink-soft py-2 font-body">
              Please choose a date above to view available times.
            </p>
          )}

          {!loading && !error && date && slots.length === 0 && (
            <p className="text-sm text-ink-soft py-2 font-body">
              No times available for this date.
            </p>
          )}

          {!loading && !error && date && slots.length > 0 && (
            <div className="flex flex-wrap gap-3 py-2">
              {slots.map((slot) => {
                const isSelected = time === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => onSelectTime(slot.time)}
                    className={`rounded-full px-5 py-2.5 text-sm font-body transition-all duration-300 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay ${
                      !slot.available
                        ? "opacity-30 line-through pointer-events-none border border-ink/10 text-ink"
                        : isSelected
                        ? "bg-ink text-bone border border-ink"
                        : "border border-ink/20 hover:border-ink text-ink bg-transparent"
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <button
          type="button"
          disabled={!date || !time}
          onClick={onContinue}
          className="bg-ink text-bone rounded-full px-8 py-3.5 hover:bg-clay transition-colors disabled:opacity-40 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay cursor-pointer font-body text-sm tracking-wide"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

interface DetailsStepProps {
  selectedService: Service;
  date: string;
  time: string;
  name: string;
  whatsapp: string;
  email: string;
  notes: string;
  onChangeField: (field: string, value: string) => void;
  onSuccess: (confirmation: BookingConfirmation) => void;
}

export function DetailsStep({
  selectedService,
  date,
  time,
  name,
  whatsapp,
  email,
  notes,
  onChangeField,
  onSuccess,
}: DetailsStepProps) {
  const [errors, setErrors] = useState<{
    name?: string;
    whatsapp?: string;
    email?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: { name?: string; whatsapp?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!whatsapp.trim()) {
      newErrors.whatsapp = "Please enter your WhatsApp number.";
    } else if (!/^\+?\d[\d\s]{7,15}$/.test(whatsapp.trim())) {
      newErrors.whatsapp =
        "Please enter a valid WhatsApp number (8-15 digits).";
    }

    const trimmedEmail = email.trim();
    const atIdx = trimmedEmail.indexOf("@");
    if (
      !trimmedEmail ||
      atIdx === -1 ||
      !trimmedEmail.slice(atIdx).includes(".")
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanedWhatsapp = whatsapp.trim().replace(/\s+/g, "");
      const confirmation = await createBooking({
        serviceSlug: selectedService.slug,
        date,
        time,
        name: name.trim(),
        whatsapp: cleanedWhatsapp,
        email: email.trim(),
        notes: notes.trim() || undefined,
      });
      onSuccess(confirmation);
    } catch (err) {
      setApiError(
        err instanceof Error
          ? err.message
          : "An error occurred while confirming your reservation."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start font-body">
      <div className="order-1 md:col-span-1 md:order-2 bg-linen p-6 rounded-lg border border-ink/5">
        <h3 className="font-display text-lg text-ink mb-4 pb-3 border-b border-ink/10">
          Ritual Summary
        </h3>
        <div className="space-y-4 text-sm">
          <div>
            <span className="text-xs uppercase tracking-widest text-ink-soft block mb-1">
              Service
            </span>
            <span className="font-medium text-ink">
              {selectedService.name}
            </span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-ink-soft block mb-1">
              Date & Time
            </span>
            <span className="text-ink">
              {formatDateDisplay(date)} at {time}
            </span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-ink-soft block mb-1">
              Duration
            </span>
            <span className="text-ink">
              {selectedService.durationMinutes} minutes
            </span>
          </div>
          <div className="pt-3 border-t border-ink/10 flex justify-between items-baseline">
            <span className="text-xs uppercase tracking-widest text-ink-soft">
              Total
            </span>
            <span className="font-display text-lg text-ink">
              {formatPrice(selectedService.priceIdr)}
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="order-2 md:col-span-2 md:order-1 space-y-6"
      >
        {apiError && (
          <div
            className="bg-bone-deep border border-ink/10 p-4 text-sm text-[#a04c2e] rounded-lg"
            role="alert"
          >
            {apiError}
          </div>
        )}

        <div>
          <label
            htmlFor="booking-name"
            className="block text-xs uppercase tracking-[0.2em] text-ink-soft mb-2"
          >
            Name *
          </label>
          <input
            id="booking-name"
            type="text"
            value={name}
            onChange={(e) => {
              onChangeField("name", e.target.value);
              if (errors.name)
                setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            className="bg-transparent border-b border-ink/20 focus:border-clay outline-none py-3 w-full text-ink transition-colors"
          />
          {errors.name && (
            <p className="text-sm text-[#a04c2e] mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="booking-whatsapp"
            className="block text-xs uppercase tracking-[0.2em] text-ink-soft mb-2"
          >
            WhatsApp Number *
          </label>
          <input
            id="booking-whatsapp"
            type="tel"
            placeholder="+62 …"
            value={whatsapp}
            onChange={(e) => {
              onChangeField("whatsapp", e.target.value);
              if (errors.whatsapp)
                setErrors((prev) => ({ ...prev, whatsapp: undefined }));
            }}
            className="bg-transparent border-b border-ink/20 focus:border-clay outline-none py-3 w-full text-ink transition-colors placeholder:text-ink-soft/40"
          />
          {errors.whatsapp && (
            <p className="text-sm text-[#a04c2e] mt-1">{errors.whatsapp}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="booking-email"
            className="block text-xs uppercase tracking-[0.2em] text-ink-soft mb-2"
          >
            Email *
          </label>
          <input
            id="booking-email"
            type="email"
            value={email}
            onChange={(e) => {
              onChangeField("email", e.target.value);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className="bg-transparent border-b border-ink/20 focus:border-clay outline-none py-3 w-full text-ink transition-colors"
          />
          {errors.email && (
            <p className="text-sm text-[#a04c2e] mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="booking-notes"
            className="block text-xs uppercase tracking-[0.2em] text-ink-soft mb-2"
          >
            Notes
          </label>
          <textarea
            id="booking-notes"
            rows={3}
            placeholder="Anything we should know — preferences, sensitivities, occasions."
            value={notes}
            onChange={(e) => onChangeField("notes", e.target.value)}
            className="bg-transparent border-b border-ink/20 focus:border-clay outline-none py-3 w-full text-ink transition-colors resize-y placeholder:text-ink-soft/40"
          />
        </div>

        <div className="pt-6 flex justify-end">
          <MagneticButton
            type="submit"
            disabled={isSubmitting}
            className="bg-ink text-bone rounded-full px-8 py-3.5 hover:bg-clay transition-colors disabled:opacity-40 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay cursor-pointer font-body text-sm tracking-wide"
          >
            {isSubmitting ? "Confirming…" : "Confirm booking"}
          </MagneticButton>
        </div>
      </form>
    </div>
  );
}

interface ConfirmStepProps {
  confirmation: BookingConfirmation;
}

export function ConfirmStep({ confirmation }: ConfirmStepProps) {
  const [whatsappUrl, setWhatsappUrl] = useState("https://wa.me/6281200000000");
  const svgRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const checkRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let cancelled = false;
    getSiteInfo()
      .then((info) => {
        if (!cancelled && info.whatsappUrl) {
          setWhatsappUrl(info.whatsappUrl);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!circleRef.current || !checkRef.current) return;
        const circleLen = circleRef.current.getTotalLength();
        const checkLen = checkRef.current.getTotalLength();

        gsap.set(circleRef.current, {
          strokeDasharray: circleLen,
          strokeDashoffset: circleLen,
        });
        gsap.set(checkRef.current, {
          strokeDasharray: checkLen,
          strokeDashoffset: checkLen,
        });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(circleRef.current, { strokeDashoffset: 0, duration: 0.8 }).to(
          checkRef.current,
          { strokeDashoffset: 0, duration: 0.5 },
          "-=0.3"
        );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (!circleRef.current || !checkRef.current) return;
        gsap.set([circleRef.current, checkRef.current], {
          strokeDashoffset: 0,
          strokeDasharray: "none",
        });
      });
    },
    { scope: svgRef }
  );

  return (
    <div className="text-center py-8 max-w-lg mx-auto font-body">
      <svg
        ref={svgRef}
        className="w-20 h-20 mx-auto mb-8 text-clay"
        viewBox="0 0 64 64"
        fill="none"
      >
        <circle
          ref={circleRef}
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          ref={checkRef}
          d="M20 32L28 40L44 24"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <h2 className="font-display text-3xl md:text-4xl text-ink mb-6">
        Your ritual is reserved.
      </h2>

      <div className="bg-linen p-6 rounded-lg border border-ink/5 mb-8 text-left">
        <span className="text-xs uppercase tracking-[0.2em] text-ink-soft block mb-1 text-center">
          Booking Reference
        </span>
        <p className="font-display text-3xl tracking-wide text-ink text-center mb-6 pb-6 border-b border-ink/10">
          {confirmation.reference}
        </p>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-soft">Service</span>
            <span className="font-medium text-ink text-right">
              {confirmation.service.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Date & Time</span>
            <span className="text-ink text-right">
              {formatDateDisplay(confirmation.date)} at {confirmation.time}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Guest</span>
            <span className="text-ink text-right">{confirmation.name}</span>
          </div>
        </div>
      </div>

      <p className="text-ink-soft text-sm mb-10 leading-relaxed">
        We&apos;ll confirm on WhatsApp shortly. This is a template preview — no
        real booking was made.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <TransitionLink
          href="/"
          className="bg-ink text-bone hover:bg-clay rounded-full px-8 py-3.5 text-sm transition-colors duration-300 inline-block font-body focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay"
        >
          Back to home
        </TransitionLink>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-ink/20 hover:border-ink rounded-full px-7 py-3.5 text-sm text-ink transition-colors duration-300 inline-block font-body focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay"
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
