import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getServices, getSiteInfo } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book a Ritual — Yabhasyuka",
};

export default async function BookingPage() {
  const [services, siteInfo] = await Promise.all([
    getServices(),
    getSiteInfo(),
  ]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-bone text-ink">
      <Navbar />
      <main className="flex-grow pt-36 pb-24">
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-ink-soft block mb-3 font-body">
            Booking
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-ink">
            Reserve your ritual.
          </h1>
        </div>
        <div className="max-w-4xl mx-auto px-6">
          <Suspense
            fallback={
              <div className="py-20 text-center text-ink-soft text-sm font-body">
                Loading booking experience...
              </div>
            }
          >
            <BookingFlow services={services} />
          </Suspense>
        </div>
      </main>
      <Footer
        instagramUrl={siteInfo.instagramUrl}
        whatsappUrl={siteInfo.whatsappUrl}
        email={siteInfo.email}
        address={siteInfo.address}
        city={siteInfo.city}
      />
    </div>
  );
}
