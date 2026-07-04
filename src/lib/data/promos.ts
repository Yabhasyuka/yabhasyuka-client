import type { Promo } from "../api/types";

export const promos: Promo[] = [
  {
    id: "opening-ritual",
    title: "The Opening Ritual",
    description: "To celebrate the launch of our new sanctuary in Renon, enjoy a 25% savings on your first visit. Experience any of our signature therapies, meticulously tailored to restore balance to your body and mind.",
    discountLabel: "25% Off First Visit",
    validFrom: "2026-07-01",
    validUntil: "2026-08-31",
    image: "/images/promos/opening-ritual.webp",
    active: true
  },
  {
    id: "duo-retreat",
    title: "The Duo Retreat",
    description: "A shared journey of quiet restoration. Book any two therapies together for a parallel experience in our private double suites, complete with complimentary botanical teas and extended head rituals.",
    discountLabel: "Complimentary Add-on",
    validFrom: "2026-02-01",
    validUntil: "2026-04-30",
    image: "/images/promos/duo-retreat.webp",
    active: false
  }
];
