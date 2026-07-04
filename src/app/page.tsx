import React from "react";
import {
  getServices,
  getActivePromos,
  getProducts,
  getTestimonials,
  getFaqs,
  getSiteInfo,
} from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
import { Hero } from "@/components/sections/Hero";
import { PromoStrip } from "@/components/sections/PromoStrip";
import { About } from "@/components/sections/About";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { GiftVoucher } from "@/components/sections/GiftVoucher";
import { LocationSection } from "@/components/sections/LocationSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default async function Home() {
  const [services, promos, products, testimonials, faqs, site] = await Promise.all([
    getServices(),
    getActivePromos(),
    getProducts(),
    getTestimonials(),
    getFaqs(),
    getSiteInfo(),
  ]);

  return (
    <div className="min-h-screen bg-bone text-ink font-body selection:bg-clay/20 selection:text-ink">
      <Navbar />
      <main>
        <Hero />
        <PromoStrip promos={promos} />
        <About />
        <ServicesSection services={services} />
        <ProductsSection products={products} />
        <Testimonials testimonials={testimonials} />
        <GiftVoucher />
        <LocationSection site={site} />
        <FaqSection faqs={faqs} />
        <ContactSection site={site} />
      </main>
      <Footer
        address={site.address}
        city={site.city}
        email={site.email}
        instagramUrl={site.instagramUrl}
        whatsappUrl={site.whatsappUrl}
      />
      <WhatsAppFab href={site.whatsappUrl} />
    </div>
  );
}
