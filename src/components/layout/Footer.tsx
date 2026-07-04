"use client";

import React from "react";
import { TransitionLink } from "@/components/ui/TransitionLink";

export function Footer({
  instagramUrl,
  whatsappUrl,
  email,
  address,
  city,
}: {
  instagramUrl: string;
  whatsappUrl: string;
  email: string;
  address: string;
  city: string;
}) {
  return (
    <footer className="bg-ink text-bone pt-20 pb-12 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="font-display text-[12vw] leading-none tracking-tight text-bone text-center md:text-left select-none">
            Yabhasyuka
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16">
          <div className="flex flex-col gap-3">
            <span className="font-display text-xs tracking-widest text-bone/50 uppercase mb-2">
              Navigation
            </span>
            <TransitionLink
              href="/#about"
              className="text-sm text-bone/80 hover:text-bone transition-colors"
            >
              About
            </TransitionLink>
            <TransitionLink
              href="/services"
              className="text-sm text-bone/80 hover:text-bone transition-colors"
            >
              Services
            </TransitionLink>
            <TransitionLink
              href="/products"
              className="text-sm text-bone/80 hover:text-bone transition-colors"
            >
              Products
            </TransitionLink>
            <TransitionLink
              href="/promo"
              className="text-sm text-bone/80 hover:text-bone transition-colors"
            >
              Promo
            </TransitionLink>
            <TransitionLink
              href="/location"
              className="text-sm text-bone/80 hover:text-bone transition-colors"
            >
              Location
            </TransitionLink>
            <TransitionLink
              href="/contact"
              className="text-sm text-bone/80 hover:text-bone transition-colors"
            >
              Contact
            </TransitionLink>
            <TransitionLink
              href="/booking"
              className="text-sm text-bone/80 hover:text-bone transition-colors"
            >
              Book a Ritual
            </TransitionLink>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-display text-xs tracking-widest text-bone/50 uppercase mb-2">
              Contact & Location
            </span>
            <p className="text-sm text-bone/80 leading-relaxed">
              {address}
              <br />
              {city}
            </p>
            <a
              href={`mailto:${email}`}
              className="text-sm text-bone/80 hover:text-bone transition-colors mt-2 block"
            >
              {email}
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-display text-xs tracking-widest text-bone/50 uppercase mb-2">
              Connect
            </span>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-bone/80 hover:text-bone transition-colors"
            >
              Instagram
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-bone/80 hover:text-bone transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-bone/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-bone/50">
          <p>© 2026 Yabhasyuka · Denpasar, Bali</p>
          <p>Template preview — brand identity in progress</p>
        </div>
      </div>
    </footer>
  );
}
