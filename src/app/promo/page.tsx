import { Metadata } from "next";
import Image from "next/image";
import { getPromos, getSiteInfo } from "@/lib/api";
import { RevealText } from "@/components/ui/RevealText";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
import { TransitionLink } from "@/components/ui/TransitionLink";

export const metadata: Metadata = {
  title: "Offers — Yabhasyuka",
};

// Local date formatter (YYYY-MM-DD to DD MMM YYYY)
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = months[monthIdx] || parts[1];
  return `${day} ${monthName} ${year}`;
}

export default async function PromoPage() {
  const [promos, site] = await Promise.all([getPromos(), getSiteInfo()]);

  const activePromos = promos.filter((p) => p.active);
  const inactivePromos = promos.filter((p) => !p.active);

  return (
    <div className="bg-bone min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-40 pb-24 md:pb-32">
        <section className="mx-auto max-w-[90rem] px-6 md:px-12">
          {/* Header */}
          <div className="mb-16 md:mb-24">
            <span className="text-xs uppercase tracking-widest text-ink-soft block mb-3 font-body">
              Offers
            </span>
            <RevealText
              as="h1"
              className="font-display text-5xl md:text-6xl text-ink leading-tight"
            >
              {"Seasonal rituals & offers."}
            </RevealText>
          </div>

          {/* Active / Featured Promos */}
          {activePromos.length > 0 ? (
            <div className="flex flex-col gap-16 md:gap-24">
              {activePromos.map((promo) => (
                <div
                  key={promo.id}
                  className="bg-linen flex flex-col md:flex-row items-stretch border border-ink/5 overflow-hidden"
                >
                  {/* Left Side: Parallax Image */}
                  <ParallaxImage
                    src={promo.image}
                    alt={promo.title}
                    className="aspect-[4/5] md:w-1/2 w-full"
                    priority
                  />

                  {/* Right Side: Editorial Content */}
                  <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center md:w-1/2">
                    <span className="text-[10px] uppercase tracking-widest text-ink-soft font-body mb-6 block">
                      Yabhasyuka Wellness · Bali
                    </span>
                    <span className="font-display text-3xl md:text-4xl text-clay leading-tight mb-2">
                      {promo.discountLabel}
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl text-ink leading-tight mb-4">
                      {promo.title}
                    </h2>
                    <p className="font-body text-base text-ink-soft leading-relaxed mb-6">
                      {promo.description}
                    </p>
                    <div className="text-xs uppercase tracking-widest text-ink-soft mb-8 font-body">
                      Valid until {formatDate(promo.validUntil)}
                    </div>
                    <div>
                      <TransitionLink
                        href="/booking"
                        className="bg-ink text-bone rounded-full px-7 py-3.5 hover:bg-clay transition-colors inline-block text-center font-body text-sm font-medium"
                      >
                        Book with this offer
                      </TransitionLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Calm Empty State */
            <div className="bg-linen p-12 text-center my-12 border border-ink/5">
              <p className="font-body text-ink-soft text-lg">
                No offers right now — follow{" "}
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-clay transition-colors"
                >
                  @instagram
                </a>{" "}
                for the next one.
              </p>
            </div>
          )}

          {/* Inactive / Past Promos */}
          {inactivePromos.length > 0 && (
            <div className="mt-24 md:mt-32">
              <div className="border-t border-ink/15 pt-4 mt-24 mb-12">
                <h3 className="font-display text-sm tracking-widest text-ink-soft uppercase">
                  Past offers
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                {inactivePromos.map((promo) => (
                  <div
                    key={promo.id}
                    className="flex items-center gap-6 opacity-60 grayscale py-4 border-b border-ink/5"
                  >
                    <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-linen overflow-hidden">
                      <Image
                        src={promo.image}
                        alt={promo.title}
                        fill
                        sizes="(max-width: 768px) 80px, 96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-display text-lg md:text-xl text-ink">
                        {promo.title}
                      </h4>
                      <p className="text-xs uppercase tracking-widest text-ink-soft mt-1 font-body">
                        {formatDate(promo.validFrom)} —{" "}
                        {formatDate(promo.validUntil)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
