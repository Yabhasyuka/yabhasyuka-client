import { Metadata } from "next";
import { getSiteInfo } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
import { LocationSection } from "@/components/sections/LocationSection";

export const metadata: Metadata = {
  title: "Location — Yabhasyuka",
  description:
    "Find Yabhasyuka in the heart of Denpasar, Bali. Address, opening hours, and directions.",
};

export default async function LocationPage() {
  const site = await getSiteInfo();

  return (
    <div className="bg-bone min-h-screen flex flex-col font-body text-ink selection:bg-clay/20 selection:text-ink">
      <Navbar />
      <main className="flex-grow pt-16">
        <LocationSection site={site} />
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
