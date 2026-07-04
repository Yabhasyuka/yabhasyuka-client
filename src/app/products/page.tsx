import { Metadata } from "next";
import { getProducts, getSiteInfo } from "@/lib/api";
import ProductGrid from "@/components/products/ProductGrid";
import { RevealText } from "@/components/ui/RevealText";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";

export const metadata: Metadata = {
  title: "Products — Yabhasyuka",
};

export default async function ProductsPage() {
  const [products, site] = await Promise.all([getProducts(), getSiteInfo()]);

  return (
    <div className="bg-bone min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-40 pb-24 md:pb-32">
        <section className="mx-auto max-w-[90rem] px-6 md:px-12">
          {/* Header */}
          <div className="mb-16 md:mb-24">
            <span className="text-xs uppercase tracking-widest text-ink-soft block mb-3 font-body">
              The Shelf
            </span>
            <RevealText
              as="h1"
              className="font-display text-5xl md:text-6xl text-ink leading-tight mb-4"
            >
              Take the ritual home.
            </RevealText>
            <p className="text-ink-soft text-lg font-body max-w-xl">
              Small-batch botanicals used in our treatments — available at the spa.
            </p>
          </div>

          {/* Product Grid */}
          <ProductGrid products={products} whatsappUrl={site.whatsappUrl} />
        </section>
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
