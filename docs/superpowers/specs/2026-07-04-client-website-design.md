# Yabhasyuka Client Website — Design Spec

**Date:** 2026-07-04
**Status:** Approved direction, template stage (no backend/admin yet)
**Repo:** `Yabhasyuka/yabhasyuka-client` (org folder `/Yabhasyuka` also holds `yabhasyuka-admin` and `yabhasyuka-be`, both untouched this phase)

## 1. Brand context

Yabhasyuka is an elevated beauty wellness spa in Denpasar, Bali. Floor 1: clinic & medical aesthetic; floors 2–3: spa experience. Digital branding leads with **beauty wellness & spa experience**; medical aesthetic appears only inside treatment packages. Target: women 20–60, upper-middle class, in Denpasar/Ubud/Kuta/Jimbaran.

Mood keywords: **quiet luxury, soft wellness, sculptural beauty, Bali warmth, clean editorial.** Anti-goals: too clinical, too glam, too pink, too salon, too bridal.

No brand identity exists yet (brand designer not hired). Everything visual is a **placeholder token** the designer's work will later replace.

## 2. Creative direction — "Sculpted Calm"

- **Palette (placeholder, single token file):** bone `#F5F1EA`, ink `#1F1D1A`, warm clay `#B08968`, plus derived tints. Dark sections use ink with bone text.
- **Type (placeholder, swappable):** editorial serif for display (Fraunces via next/font), quiet grotesque for body (Inter).
- **Imagery:** real photography — sourced from free-license stock (Unsplash/Pexels: spa, massage, warm interiors, skincare product, Bali texture) and/or generated with the Gemini image skill for gaps (e.g. product bottles with no branding). **No SVG-text placeholder art.** Images stored in `public/images/`, credited in HANDOVER.md.
- **Motion grammar:** slow, breathing eases (`power2.out`, `expo.out`, 0.8–1.6s), line-by-line SplitText headline reveals, scroll-triggered staggers, image parallax, magnetic CTAs, custom cursor (desktop only). `prefers-reduced-motion`: no WebGL, no scroll hijack, instant reveals.
- **WebGL accent (hero only):** one `@react-three/fiber` canvas — an organic, silk-like sculptural form (noise-displaced geometry, bone/clay material) that slowly undulates, tilts subtly toward the cursor, and recedes/morphs on scroll. Static image fallback for reduced-motion/no-WebGL.

## 3. Page transitions (key requirement)

Navigations into detail views (services, products, promo, booking) must feel **smooth and satisfying**, not a hard swap:

- A `TransitionLink` component + transition provider intercepts navigation: GSAP exit animation (a bone-toned curtain/clip-path sweep over the viewport, ~0.6s) → `router.push` → enter animation (curtain lifts, destination hero content staggers in).
- Where the click origin is an image card (service/product), the card's image visually carries into the destination hero (GSAP Flip-style continuity) when feasible; curtain-only elsewhere. Continuity is best-effort per card, curtain is the guaranteed baseline.
- Browser back/forward and direct URL loads get the enter animation only.

## 4. Pages & sections

**`/` (home)** — everything on one page, navbar anchor-links to sections:
1. **Hero** — WebGL sculpture, brand statement, "Book your ritual" CTA
2. **Promo strip** — rendered only when mock promo data has an active promo; visual language designed to match social-media promo posts
3. **About** — the 3-floor story, quiet-luxury copy
4. **Services** — three pillars from the brief: *Relaxation*, *Sculpting (face · head · body)*, *Aesthetic* — image cards with hover distortion, each → `/services/[slug]`
5. **Products** — retail/skincare grid teaser → `/products`
6. **Testimonials** — horizontal drag/marquee, mock reviews
7. **Gift voucher** — CTA band (purchase later, teaser now)
8. **Location** — embedded map (Denpasar), address, hours
9. **FAQ** — accordion: arrival, what to expect, cancellation
10. **Contact / footer** — WhatsApp, Instagram, email, mini nav

**`/services`** — all treatments grouped by pillar.
**`/services/[slug]`** — treatment detail: full-bleed image, description, duration, price, benefits, "Book this treatment" → booking with the service preselected.
**`/products`** — product grid; per-product detail can be a modal/expanded card (no `[slug]` page at template stage).
**`/promo`** — active + past promos; per-promo layout shareable for social traffic.
**`/booking`** — 4 steps in one client flow: ① treatment → ② date & time slot → ③ guest details (name, WhatsApp number, email, notes) → ④ confirmation with mock booking reference. Validates inputs; simulated latency; state in React (no state library).

Site-wide: floating WhatsApp button, sticky navbar (transparent → solid on scroll).

## 5. Architecture

- **Stack:** Next.js 15 (App Router, TypeScript), Tailwind CSS v4, GSAP + `@gsap/react` (ScrollTrigger, SplitText, Flip), Lenis (`lenis/react`), `three` + `@react-three/fiber` + `@react-three/drei` (hero only).
- **Structure:**
  - `src/app/` — routes (home, services, services/[slug], products, promo, booking)
  - `src/components/sections/` — one file per home section
  - `src/components/ui/` — TransitionLink, MagneticButton, RevealText, ParallaxImage, Accordion, Navbar, Footer, WhatsAppFab
  - `src/components/three/` — HeroScene
  - `src/lib/api/` — **mock API layer**: typed functions (`getServices`, `getService(slug)`, `getProducts`, `getPromos`, `getAvailableSlots(serviceId, date)`, `createBooking(payload)`) returning mock JSON with ~300ms simulated latency. This is the contract `yabhasyuka-be` implements later; components never import mock data directly.
  - `src/lib/data/` — the mock JSON/TS fixtures
  - `src/styles/tokens.css` — all brand placeholders (colors, fonts) in CSS variables
- **`docs/HANDOVER.md`:** what is mock, the full API contract for `yabhasyuka-be`, TODO list for backend + admin integration (bookings CRUD, promo management, slot management, notifications), image credits, and where brand tokens live for the brand-identity swap.

## 6. Out of scope (template stage)

CMS, i18n (English only), payments, auth, admin app, backend, blog, before/after gallery (needs real photos/consent), email/WhatsApp notifications. All listed in HANDOVER.md as future work.

## 7. Success criteria

- Home page scrolls smoothly (Lenis) with choreographed reveals; hero WebGL runs 60fps on a mid-range laptop and degrades gracefully on mobile/reduced-motion.
- Clicking a service/product plays the transition and lands on detail without layout jank.
- Booking flow completes end-to-end against mock data and shows a confirmation.
- `npm run build` passes; no console errors on core flows.
- A future agent can read HANDOVER.md and know exactly how to wire `yabhasyuka-be`/`yabhasyuka-admin`.
