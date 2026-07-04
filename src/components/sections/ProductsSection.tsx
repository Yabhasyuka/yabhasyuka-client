import React from "react";
import Image from "next/image";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { Product } from "@/lib/api";

function formatIdr(price: number): string {
  const inThousands = Math.round(price / 1000);
  return `IDR ${inThousands}K`;
}

export function ProductsSection({ products }: { products: Product[] }) {
  return (
    <section id="products" className="py-24 md:py-40 bg-bone overflow-hidden">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12 mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs uppercase tracking-[0.25em] text-ink-soft font-body">
              The Shelf
            </span>
            <span className="h-[1px] w-12 bg-ink/15" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-tight">
            Take the ritual home.
          </h2>
        </div>
        <TransitionLink
          href="/products"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ink hover:text-clay transition-colors py-3 px-6 border border-ink/20 hover:border-clay rounded-full self-start md:self-auto"
        >
          <span>All products</span>
          <span>→</span>
        </TransitionLink>
      </div>

      {/* Horizontal scroll row */}
      <div className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-6 md:px-12">
        {products.map((product) => (
          <div
            key={product.id}
            className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[360px] group block"
          >
            <TransitionLink href="/products" className="block">
              <div className="aspect-square w-full bg-linen p-8 mb-6 overflow-hidden relative flex items-center justify-center border border-ink/5">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="360px"
                  className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="font-display text-xl text-ink group-hover:text-clay transition-colors duration-300 mb-2">
                {product.name}
              </h3>
              <div className="flex items-center justify-between text-xs tracking-[0.2em] uppercase text-ink-soft font-body pt-2 border-t border-ink/10">
                <span>{product.category}</span>
                <span className="text-ink font-medium">{formatIdr(product.priceIdr)}</span>
              </div>
            </TransitionLink>
          </div>
        ))}
      </div>
    </section>
  );
}
