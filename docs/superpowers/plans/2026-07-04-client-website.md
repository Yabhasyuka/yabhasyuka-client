# Yabhasyuka Client Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the template-stage Yabhasyuka client website (Awwwards-grade creative frontend) per the approved spec at `docs/superpowers/specs/2026-07-04-client-website-design.md`.

**Architecture:** Next.js 15 App Router site. All content flows through a typed mock API layer (`src/lib/api/`) that mirrors the future `yabhasyuka-be` contract. Motion is GSAP + Lenis; one R3F WebGL canvas in the hero. A transition provider wraps the app for curtain-style route transitions.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, GSAP + @gsap/react (ScrollTrigger, SplitText, Flip), lenis, three + @react-three/fiber + @react-three/drei.

## Global Constraints

- Palette tokens (only in `src/styles/tokens.css`): bone `#F5F1EA`, ink `#1F1D1A`, clay `#B08968`.
- Fonts via `next/font`: Fraunces (display), Inter (body). Referenced only through CSS vars.
- English copy only. Brand voice: quiet luxury, soft wellness — never clinical, glam, pink, salon, bridal.
- `prefers-reduced-motion`: no WebGL, no smooth-scroll, instant reveals (use `gsap.matchMedia`).
- Components never import fixtures directly — only via `src/lib/api/` functions.
- Real imagery in `public/images/` (Unsplash/Pexels or Gemini-generated); SVG/text art allowed sparingly as accents only.
- Every task ends with `npm run build` (or dev-server smoke check) passing and a commit.

---

### Task 1: Scaffold app + tokens + fonts

**Files:** create Next app in repo root (`create-next-app` w/ TS, Tailwind, App Router, src dir), `src/styles/tokens.css`, edit `src/app/layout.tsx` (fonts, metadata "Yabhasyuka — Elevated Beauty Wellness Spa · Bali"), `src/app/globals.css`.

**Produces:** CSS vars `--color-bone|ink|clay`, `--font-display`, `--font-body`; Tailwind theme mapping (`bg-bone`, `text-ink`, `text-clay`, `font-display`, `font-body`).

- [ ] Scaffold via `npx create-next-app@latest`, install `gsap @gsap/react lenis three @react-three/fiber @react-three/drei`
- [ ] Add tokens.css + font setup; delete boilerplate page content
- [ ] Verify: `npm run build` passes
- [ ] Commit

### Task 2: Types + mock API layer

**Files:** Create `src/lib/api/types.ts`, `src/lib/api/index.ts`, `src/lib/data/services.ts`, `src/lib/data/products.ts`, `src/lib/data/promos.ts`, `src/lib/data/testimonials.ts`, `src/lib/data/faqs.ts`, `src/lib/data/site.ts` (address, hours, WhatsApp, Instagram).

**Produces (the backend contract — exact signatures):**

```ts
// types.ts
export type ServicePillar = "relaxation" | "sculpting" | "aesthetic";
export interface Service { slug: string; pillar: ServicePillar; name: string; tagline: string; description: string; benefits: string[]; durationMinutes: number; priceIdr: number; image: string; }
export interface Product { id: string; name: string; category: string; description: string; priceIdr: number; image: string; }
export interface Promo { id: string; title: string; description: string; discountLabel: string; validFrom: string; validUntil: string; image: string; active: boolean; }
export interface Testimonial { id: string; name: string; treatment: string; quote: string; rating: number; }
export interface Faq { question: string; answer: string; }
export interface TimeSlot { time: string; available: boolean; }
export interface BookingPayload { serviceSlug: string; date: string; time: string; name: string; whatsapp: string; email: string; notes?: string; }
export interface BookingConfirmation { reference: string; service: Service; date: string; time: string; name: string; }

// index.ts — all async, ~300ms simulated latency
getServices(): Promise<Service[]>
getService(slug: string): Promise<Service | null>
getProducts(): Promise<Product[]>
getPromos(): Promise<Promo[]>          // active + past
getActivePromos(): Promise<Promo[]>
getTestimonials(): Promise<Testimonial[]>
getFaqs(): Promise<Faq[]>
getSiteInfo(): Promise<SiteInfo>
getAvailableSlots(serviceSlug: string, date: string): Promise<TimeSlot[]>  // deterministic pseudo-random availability
createBooking(payload: BookingPayload): Promise<BookingConfirmation>       // validates required fields, returns YBS-XXXXXX ref
```

Fixtures: ≥9 services (3 per pillar, realistic spa copy & IDR pricing), ≥6 products, 2 promos (1 active), ≥5 testimonials, ≥5 FAQs.

- [ ] Write types, fixtures, api functions
- [ ] Verify usage compiles + build passes
- [ ] Commit

### Task 3: Imagery

**Files:** `public/images/*.jpg|webp` (hero fallback, about x2, 9 service images, 6 product shots, 2 promo, location/interior), credits list kept for HANDOVER.md.

- [ ] Download free-license photos (Unsplash/Pexels source URLs) matching mood: warm light, linen, stone, spa hands, skincare bottles, Bali texture
- [ ] Generate any un-findable shots with gemini-imagegen skill (e.g. unbranded product bottles in bone/clay palette)
- [ ] Optimize (resize ≤1920w, webp) and commit

### Task 4: Motion + UI primitives

**Files:** Create `src/components/providers/SmoothScroll.tsx` (Lenis + GSAP ticker sync), `src/components/providers/TransitionProvider.tsx` + `src/components/ui/TransitionLink.tsx`, `src/components/ui/RevealText.tsx` (SplitText line reveal), `src/components/ui/ParallaxImage.tsx`, `src/components/ui/MagneticButton.tsx`, `src/components/ui/Accordion.tsx`, `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`, `src/components/ui/WhatsAppFab.tsx`. Wire providers in `layout.tsx`.

**Interfaces:** `TransitionLink({ href, children, className })` — plays curtain exit (clip-path sweep, ~0.6s, bone panel with small wordmark), navigates, enter animation on route mount via provider context. `RevealText({ as, children, delay })`. All primitives respect `gsap.matchMedia` reduced-motion.

- [ ] Build primitives; Navbar: transparent→bone on scroll, anchor links (About, Services, Products, Promo, Location, Contact) + Book CTA
- [ ] Verify in dev server (scroll smooth, transition plays between routes)
- [ ] Commit

### Task 5: Hero WebGL scene

**Files:** Create `src/components/three/HeroScene.tsx` (R3F Canvas, noise-displaced organic mesh — silk/sculpture feel, bone/clay lighting, mouse tilt + scroll recede; `dpr=[1,1.75]`), static-image fallback component.

- [ ] Build scene + fallback (reduced-motion/no-WebGL → image)
- [ ] Verify smooth in dev, no console errors
- [ ] Commit

### Task 6: Home page sections

**Files:** Create `src/components/sections/Hero.tsx`, `PromoStrip.tsx`, `About.tsx`, `ServicesSection.tsx`, `ProductsSection.tsx`, `Testimonials.tsx`, `GiftVoucher.tsx`, `LocationSection.tsx`, `FaqSection.tsx`, `ContactSection.tsx`; compose in `src/app/page.tsx` (server component fetching from api layer, passing data down).

Key behaviors: PromoStrip renders only if `getActivePromos()` non-empty; services cards → `/services/[slug]` via TransitionLink with hover image scale/distortion; testimonials horizontal drag/marquee; location = styled OpenStreetMap embed + hours; FAQ uses Accordion. Section IDs match navbar anchors.

- [ ] Build sections in order
- [ ] Verify full-page scroll choreography in dev; build passes
- [ ] Commit (2–3 commits allowed: hero+about, middle, tail)

### Task 7: Services pages

**Files:** Create `src/app/services/page.tsx` (all treatments grouped by pillar), `src/app/services/[slug]/page.tsx` (full-bleed hero image, name, tagline, description, benefits, duration, IDR price, "Book this treatment" → `/booking?service=slug`), `generateStaticParams` from api layer.

- [ ] Build both routes with enter animations
- [ ] Verify transitions from home cards feel continuous; build passes
- [ ] Commit

### Task 8: Products + Promo pages

**Files:** Create `src/app/products/page.tsx` (grid, expandable detail card/modal — no slug route), `src/app/promo/page.tsx` (active promos featured large + past promos muted, social-shareable layout).

- [ ] Build both; PromoStrip links here
- [ ] Verify + commit

### Task 9: Booking flow

**Files:** Create `src/app/booking/page.tsx` + `src/components/booking/BookingFlow.tsx` (client), step components (ServiceStep, ScheduleStep — native `<input type="date">` styled + slot grid from `getAvailableSlots`, DetailsStep — name/whatsapp/email/notes with validation, ConfirmStep — reference display). Reads `?service=` to preselect. GSAP step transitions. React state only.

- [ ] Build 4-step flow end-to-end against mock api
- [ ] Verify: complete a booking in dev, invalid inputs blocked
- [ ] Commit

### Task 10: HANDOVER.md + polish + ship

**Files:** Create `docs/HANDOVER.md` (what's mock; full API contract from Task 2; TODO for yabhasyuka-be — REST endpoints mirroring api functions — and yabhasyuka-admin — bookings/promos/slots management; image credits; brand-token swap guide), `README.md`. Polish: metadata/OG, favicon, 404 page, lint.

- [ ] Write HANDOVER.md + README
- [ ] Final `npm run build` + lint clean; smoke the 4 core flows (scroll home, service transition, promo, booking)
- [ ] Push branch `worktree-website-template` → propose as initial default branch (repo is empty; PR not possible until a base branch exists — note this to the user)
