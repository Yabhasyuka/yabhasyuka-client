export type ServicePillar = "relaxation" | "sculpting" | "aesthetic";

export interface Service {
  slug: string;
  pillar: ServicePillar;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  durationMinutes: number;
  priceIdr: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  priceIdr: number;
  image: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  discountLabel: string;
  validFrom: string;
  validUntil: string;
  image: string;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  treatment: string;
  quote: string;
  rating: number;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingPayload {
  serviceSlug: string;
  date: string;
  time: string;
  name: string;
  whatsapp: string;
  email: string;
  notes?: string;
}

export interface BookingConfirmation {
  reference: string;
  service: Service;
  date: string;
  time: string;
  name: string;
}

export interface SiteInfo {
  name: string;
  tagline: string;
  address: string;
  city: string;
  mapEmbedUrl: string;
  whatsapp: string;
  whatsappUrl: string;
  instagram: string;
  instagramUrl: string;
  email: string;
  hours: {
    days: string;
    open: string;
    close: string;
  }[];
}
