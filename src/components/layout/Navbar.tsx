"use client";

import React, { useState, useEffect, useRef } from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Products", href: "/#products" },
    { label: "Promo", href: "/promo" },
    { label: "Location", href: "/#location" },
    { label: "Contact", href: "/#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!navRef.current) return;
        // fromTo + immediateRender:false so a killed tween can never leave the nav hidden
        gsap.fromTo(
          navRef.current,
          { y: -20, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.6,
            immediateRender: false,
            clearProps: "all",
          }
        );
      });
    },
    { scope: navRef }
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!mobileMenuRef.current) return;
        if (mobileMenuOpen) {
          gsap.to(mobileMenuRef.current, {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            pointerEvents: "auto",
          });
          gsap.fromTo(
            ".mobile-menu-link",
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.08,
              ease: "power3.out",
              delay: 0.2,
            }
          );
        } else {
          gsap.to(mobileMenuRef.current, {
            yPercent: -100,
            opacity: 0,
            duration: 0.6,
            ease: "power3.inOut",
            pointerEvents: "none",
          });
        }
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (!mobileMenuRef.current) return;
        mobileMenuRef.current.style.opacity = mobileMenuOpen ? "1" : "0";
        mobileMenuRef.current.style.pointerEvents = mobileMenuOpen
          ? "auto"
          : "none";
        mobileMenuRef.current.style.transform = "none";
      });
    },
    [mobileMenuOpen]
  );

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[85] w-full transition-all duration-500 ${
          isScrolled
            ? "bg-bone/85 backdrop-blur-md border-b border-ink/5 py-4"
            : "bg-transparent border-b border-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <TransitionLink
            href="/"
            className="font-display text-xl tracking-wide text-ink hover:text-clay transition-colors"
          >
            Yabhasyuka
          </TransitionLink>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <TransitionLink
                key={link.label}
                href={link.href}
                className="text-sm text-ink-soft hover:text-ink transition-colors duration-300"
              >
                {link.label}
              </TransitionLink>
            ))}
            <TransitionLink
              href="/booking"
              className="bg-ink text-bone hover:bg-clay rounded-full px-5 py-2.5 text-sm transition-colors duration-300 ml-2"
            >
              Book a Ritual
            </TransitionLink>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden p-2 text-ink hover:text-clay transition-colors cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 12h18M3 6h18M3 18h18"
              />
            </svg>
          </button>
        </div>
      </header>

      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-[90] bg-bone flex flex-col justify-between p-6 md:hidden opacity-0 pointer-events-none"
        style={{ transform: "translate3d(0, -100%, 0)" }}
      >
        <div className="flex items-center justify-between">
          <TransitionLink
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="font-display text-xl tracking-wide text-ink"
          >
            Yabhasyuka
          </TransitionLink>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 text-ink hover:text-clay transition-colors cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-5 my-auto">
          {navLinks.map((link) => (
            <div key={link.label} className="overflow-hidden">
              <div className="mobile-menu-link">
                <TransitionLink
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display text-3xl text-ink hover:text-clay transition-colors block py-1"
                >
                  {link.label}
                </TransitionLink>
              </div>
            </div>
          ))}
          <div className="overflow-hidden pt-4">
            <div className="mobile-menu-link">
              <TransitionLink
                href="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-ink text-bone hover:bg-clay rounded-full px-8 py-4 text-center text-lg font-display block transition-colors"
              >
                Book a Ritual
              </TransitionLink>
            </div>
          </div>
        </div>

        <div className="text-xs text-ink-soft text-center py-4 border-t border-ink/10">
          Denpasar, Bali
        </div>
      </div>
    </>
  );
}
