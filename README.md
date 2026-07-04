# Yabhasyuka Client Website

Next.js template-stage website for Yabhasyuka, an elevated beauty wellness spa in Denpasar, Bali.

This is a template-stage build that currently runs fully on a mock API layer.

## Tech Stack
*   **Core:** Next.js 15 (App Router), TypeScript
*   **Styling:** Tailwind CSS v4 (configured via PostCSS)
*   **Motion & Animation:** GSAP (with ScrollTrigger, SplitText, and Flip), Lenis (smooth scrolling)
*   **WebGL:** React Three Fiber, React Three Drei, Three.js (hero interactive ornament only)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server (accessible at http://localhost:3000)
npm run dev

# Validate types and build production bundle
npm run build
```

## Repository Structure

*   ``docs/``: Contains design specs, system architecture guidelines, and handover documents.
*   ``public/``: Static assets including AI-generated placeholder images for styling.
*   ``src/``: Application codebase including app router layouts/pages, styling tokens, UI components, data files, and mock API signatures.

## Project Transition & Handover

*   For architectural overview, future backend API endpoints mapping, and developer TODO checklist, see ``docs/HANDOVER.md``.
*   For the original creative direction, palette, and page flow specification, see ``docs/superpowers/specs/2026-07-04-client-website-design.md``.
