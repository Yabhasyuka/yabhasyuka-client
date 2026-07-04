# Handover Documentation — Yabhasyuka Client Website

This document outlines the current state, architecture, API contract, and future development guidelines for the Yabhasyuka client website template. It is designed to guide the next developer or agent taking over the implementation of this project.

---

## 1. Project Status

The client website is in the **template stage**. It runs entirely on a mock API layer and has no connection to a real backend.

*   **Mock Backend:** The client consumes mock data defined in the directory ``src/lib/data/`` via simulated asynchronous functions in ``src/lib/api/index.ts``.
*   **Fictional Business Details:** Business information—such as physical addresses, WhatsApp numbers, Instagram handles, email addresses, treatment lists, service prices, and active promo content—are fictional placeholders.
    *   Fictional data resides in ``src/lib/data/site.ts`` and ``src/lib/data/services.ts``.
*   **Placeholder Branding:** No brand identity has been delivered yet. Colors, spacing, and typography are placeholders configured as CSS custom properties in ``src/styles/tokens.css`` and loaded in ``src/app/layout.tsx``.
*   **Repo Structure:** Part of a 3-repository organization:
    *   `yabhasyuka-client` (this repository: public client website)
    *   `yabhasyuka-admin` (future admin dashboard, currently empty)
    *   `yabhasyuka-be` (future backend API, currently empty)

---

## 2. Architecture Map

The project is structured around the standard Next.js 15 App Router directory system, enhanced with GSAP animation providers and a WebGL decorative element.

### Route Structures (`src/app/`)
*   ``/``: Interactive home page sections (Hero with WebGL, Promo Strip, About, Services Pillars, Products grid preview, Testimonials slider, Gift voucher teaser, Location, FAQs).
*   ``/services``: Pillar-grouped services page.
*   `/services/[slug]`: Dedicated treatment pages with price, duration, benefits, and direct pre-selected booking entrypoint.
*   ``/products``: Retail and skincare product grid layout.
*   ``/promo``: Active and historical promo pages.
*   ``/booking``: A unified multi-step client booking wizard.

### Key Component Folders (`src/components/`)
*   ``providers/``:
    *   ``SmoothScroll.tsx`` integrates Lenis scroll-hijack container.
    *   ``TransitionProvider.tsx`` runs global exit/entry viewport animations.
*   ``ui/``: Reusable atoms and animations (e.g. ``TransitionLink.tsx``, custom buttons, and elements).
*   ``layout/``: Structural navbars, footers, and grid boundaries.
*   ``sections/``: Home page display blocks.
*   ``three/``: WebGL canvas wrapper (`HeroScene`) utilizing `@react-three/fiber` and `@react-three/drei`.
*   ``booking/``: Independent components for each stage of the booking flow.
*   ``products/``: Retail cards and display overlays.

### Motion Primitives & WebGL
*   **Lenis Scroll:** ``SmoothScroll.tsx`` handles smooth document navigation.
*   **Reveal Animations:** ``RevealText.tsx`` utilizes GSAP and SplitText to stagger lines upwards on scroll.
*   **Magnetic Effect:** ``MagneticButton.tsx`` uses simple GSAP mouse position tracking to pull the interactive buttons towards the cursor.
*   **Image Parallax:** ``ParallaxImage.tsx`` maps viewport scroll position to scale and translate the image offset inside its clipping wrapper.
*   **Hero WebGL Canvas:** ``HeroScene.tsx`` displays an organic, undulating silk-like geometry driven by noise shaders. It responds gently to mouse movement and morphs when the viewport is scrolled.

---

## 3. The API Contract

The mock functions in ``src/lib/api/index.ts`` serve as the exact functional contract for integration with the future `yabhasyuka-be`. 

### Swap Plan
To integrate the real backend, reimplement the implementation body of the methods inside ``src/lib/api/index.ts`` using `fetch` calls to `yabhasyuka-be` REST endpoints. 
*   **Rule:** Components must not require any changes. They should continue calling these same asynchronous functions.
*   **Shared Contract:** All TypeScript interfaces defined in ``src/lib/api/types.ts`` must remain the single source of truth representing request/response schemas.

### Contract Map

| Function | Parameters | Return Type | Proposed REST Endpoint |
| :--- | :--- | :--- | :--- |
| `getServices` | None | `Promise<Service[]>` | `GET /api/services` |
| `getService` | `slug: string` | `Promise<`Service` \| null>` | `GET /api/services/:slug` |
| `getProducts` | None | `Promise<Product[]>` | `GET /api/products` |
| `getPromos` | None | `Promise<Promo[]>` | `GET /api/promos` |
| `getActivePromos` | None | `Promise<Promo[]>` | `GET /api/promos?active=true` |
| `getTestimonials` | None | `Promise<Testimonial[]>` | `GET /api/testimonials` |
| `getFaqs` | None | `Promise<Faq[]>` | `GET /api/faqs` |
| `getSiteInfo` | None | `Promise<`SiteInfo`>` | `GET /api/site-info` |
| `getAvailableSlots` | `serviceSlug: string`, `date: string` | `Promise<TimeSlot[]>` | `GET /api/slots?serviceSlug={serviceSlug}&date={date}` |
| `createBooking` | `payload: `BookingPayload`` | `Promise<`BookingConfirmation`>` | `POST /api/bookings` |

---

## 4. TODO — `yabhasyuka-be` (Backend API Tasks)

The backend service needs to implement logic that exceeds simple CRUD storage:

1.  **Bookings Storage & Validation:** 
    *   Expose endpoints for bookings CRUD operations (to be consumed by `yabhasyuka-admin`).
    *   Expose a `POST /api/bookings` endpoint that enforces strict validations (checking fields, validating email syntax, and validating WhatsApp phone formatting).
2.  **Unique Booking Reference Generation:** 
    *   Generate secure, non-sequential confirmation reference codes (e.g. following the format `YBS-XXXXXX`).
3.  **Slot & Availability Engine:**
    *   Expose `GET /api/slots`.
    *   Calculate real slot availability dynamically by cross-referencing requested date, service duration, operating hours, active bookings, and staff capacity, instead of relying on client-side mock logic.
4.  **Content Management Endpoints:**
    *   Create endpoints to store and serve the list of services, retail products, active/past promotions, FAQs, and site-wide metadata (address, WhatsApp links).
5.  **Notification Dispatches:**
    *   Integrate third-party WhatsApp (e.g. via Twilio or local gateway) and email microservices. Trigger a confirmation dispatch immediately upon a successful booking creation.
6.  **Admin Authentication & Authorization:**
    *   Implement cookie-based or JWT session authentication to restrict bookings management and slot controls to authorized staff.

---

## 5. TODO — `yabhasyuka-admin` (Admin Dashboard Tasks)

A dashboard is required for internal operations team management:

1.  **Booking Management Hub:**
    *   A list interface displaying incoming bookings chronologically.
    *   Ability to filter bookings by service pillar, customer, or date.
    *   Actions to manually confirm, reschedule, or cancel a booking (with corresponding trigger flags to send cancellation updates to clients).
2.  **Schedule & Availability Control:**
    *   Define operational hours, holidays, off-duty days, and staff shifts.
    *   A dashboard block-out tool to prevent automated bookings for specific dates/slots.
3.  **Services, Products, and Promos CRUD:**
    *   Interfaces to update or add services (descriptions, prices, durations).
    *   Interface to upload and catalog products.
    *   Interface to manage promotions, allowing toggling of the active flag which controls whether the promo strip renders on the homepage.
4.  **Enquiry Stream Viewer:**
    *   A simple inbox view allowing staff to review and respond to general contact form enquiries submitted by clients.

---

## 6. TODO — Client Follow-ups

Key tasks remaining on the client-side app to transition this from template to launch-ready:

1.  **Swap Brand Tokens:**
    *   Once the design direction is finalized, open ``src/styles/tokens.css`` and adjust the core color codes (`--color-bone`, `--color-ink`, `--color-clay`, etc.).
    *   Load final Google or custom web fonts inside ``src/app/layout.tsx`` and re-bind variables (`--font-display`, `--font-body`).
2.  **Input Real Business Details:**
    *   Overwrite placeholder text values (phone number, WhatsApp URL, Instagram link, and operational hours) inside ``src/lib/data/site.ts``.
3.  **Replace Placeholder Imagery:**
    *   Swap out the current AI-generated placeholder images inside ``public/images/`` with final professional photos of the spa interior, staff, and cosmetic packages.
4.  **Map Integration:**
    *   Replace the OpenStreetMap placeholder URL in ``src/lib/data/site.ts`` with coordinates pointing to Yabhasyuka's physical address in Denpasar.
5.  **Analytics & SEO:**
    *   Inject production analytics scripts (Google Tag Manager/Meta Pixel).
    *   Build out custom SEO titles, descriptions, and OpenGraph (OG) sharing images in layout/page metadata configurations.
6.  **Internationalization (i18n):**
    *   If requested, implement multi-language support (English and Bahasa Indonesia).
7.  **Payments Integration:**
    *   Integrate a local payment gateway (e.g. Midtrans or Xendit) for optional prepayments of appointments or purchase of gift vouchers.

---

## 7. Imagery Note

All images inside ``public/images/`` are AI-generated placeholders produced using Gemini. 
*   **Visual Direction:** Styled to mimic the quiet luxury, bone/clay color palette of Yabhasyuka's branding concept.
*   **Action Required:** These files must be replaced with real, high-resolution photography before launch.

---

## 8. How to Run

Follow these commands to install dependencies, run locally, or package for production:

```bash
# Install dependencies
npm install

# Run the development server (localhost:3000)
npm run dev

# Validate typescript and compile the production build
npm run build

# Start the compiled production build locally
npm start
```
