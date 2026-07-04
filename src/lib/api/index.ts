import type {
  Service,
  Product,
  Promo,
  Testimonial,
  Faq,
  SiteInfo,
  TimeSlot,
  BookingPayload,
  BookingConfirmation
} from "./types";

import { services } from "../data/services";
import { products } from "../data/products";
import { promos } from "../data/promos";
import { testimonials } from "../data/testimonials";
import { faqs } from "../data/faqs";
import { siteInfo } from "../data/site";

// Re-export all types
export type * from "./types";

// Simulated latency helper (~300ms)
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Deterministic availability check using LCG PRNG
function getDeterministicAvailability(serviceSlug: string, date: string, time: string): boolean {
  const serialized = `${serviceSlug}-${date}-${time}`;
  let h = 0;
  for (let i = 0; i < serialized.length; i++) {
    h = Math.imul(31, h) + serialized.charCodeAt(i) | 0;
  }
  let seed = Math.abs(h);
  // Linear Congruential Generator step
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  const score = seed % 10;
  // Roughly 70% available (scores 0, 1, 2, 3, 4, 5, 6)
  return score < 7;
}

// Deterministic reference generator using LCG PRNG
function generateReference(payload: BookingPayload): string {
  const serialized = `${payload.serviceSlug}-${payload.date}-${payload.time}-${payload.name}-${payload.whatsapp}-${payload.email}`;
  let h = 0;
  for (let i = 0; i < serialized.length; i++) {
    h = Math.imul(31, h) + serialized.charCodeAt(i) | 0;
  }
  let seed = Math.abs(h);
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "";
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(random() * chars.length);
    ref += chars[idx];
  }
  return `YBS-${ref}`;
}

export async function getServices(): Promise<Service[]> {
  await delay();
  return services;
}

export async function getService(slug: string): Promise<Service | null> {
  await delay();
  return services.find((s) => s.slug === slug) || null;
}

export async function getProducts(): Promise<Product[]> {
  await delay();
  return products;
}

export async function getPromos(): Promise<Promo[]> {
  await delay();
  return promos;
}

export async function getActivePromos(): Promise<Promo[]> {
  await delay();
  return promos.filter((p) => p.active);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  await delay();
  return testimonials;
}

export async function getFaqs(): Promise<Faq[]> {
  await delay();
  return faqs;
}

export async function getSiteInfo(): Promise<SiteInfo> {
  await delay();
  return siteInfo;
}

export async function getAvailableSlots(serviceSlug: string, date: string): Promise<TimeSlot[]> {
  await delay();
  const times = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00"
  ];
  return times.map((time) => {
    const available = getDeterministicAvailability(serviceSlug, date, time);
    return { time, available };
  });
}

export async function createBooking(payload: BookingPayload): Promise<BookingConfirmation> {
  await delay();

  // Validate fields for empty/missing values
  if (!payload.serviceSlug || !payload.serviceSlug.trim()) {
    throw new Error("Service is required.");
  }
  if (!payload.date || !payload.date.trim()) {
    throw new Error("Date is required.");
  }
  if (!payload.time || !payload.time.trim()) {
    throw new Error("Time is required.");
  }
  if (!payload.name || !payload.name.trim()) {
    throw new Error("Name is required.");
  }
  if (!payload.whatsapp || !payload.whatsapp.trim()) {
    throw new Error("WhatsApp number is required.");
  }
  if (!payload.email || !payload.email.trim()) {
    throw new Error("Email address is required.");
  }

  // Validate WhatsApp number structure: 8 to 15 digits, allowing leading '+'
  const whatsappCleaned = payload.whatsapp.trim();
  const hasPlus = whatsappCleaned.startsWith("+");
  const numberPart = hasPlus ? whatsappCleaned.slice(1) : whatsappCleaned;
  if (!/^\d{8,15}$/.test(numberPart)) {
    throw new Error("WhatsApp number must be between 8 and 15 digits.");
  }

  // Validate email structure: must contain '@'
  if (!payload.email.includes("@")) {
    throw new Error("Email address must contain '@'.");
  }

  // Verify service exists in database
  const service = services.find((s) => s.slug === payload.serviceSlug);
  if (!service) {
    throw new Error(`Unknown service slug: ${payload.serviceSlug}`);
  }

  const reference = generateReference(payload);

  return {
    reference,
    service,
    date: payload.date,
    time: payload.time,
    name: payload.name
  };
}
