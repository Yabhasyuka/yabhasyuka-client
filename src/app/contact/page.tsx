import { Metadata } from "next";
import { getSiteInfo } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact — Yabhasyuka",
  description:
    "Get in touch with Yabhasyuka in Denpasar, Bali. Book online, chat on WhatsApp, or reach us by email.",
};

export default async function ContactPage() {
  const site = await getSiteInfo();

  return (
    <div className="bg-bone min-h-screen flex flex-col font-body text-ink selection:bg-clay/20 selection:text-ink">
      <Navbar />
      <main className="flex-grow pt-16">
        <ContactSection site={site} />
      </main>
      <Footer
        instagramUrl={site.instagramUrl}
        whatsappUrl={site.whatsappUrl}
        email={site.email}
        address={site.address}
        city={site.city}
      />
      <WhatsAppFab href={site.whatsappUrl} />
    </div>
  );
}
