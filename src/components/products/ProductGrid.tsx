"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Product } from "@/lib/api";

interface ProductGridProps {
  products: Product[];
  whatsappUrl: string;
}

export default function ProductGrid({ products, whatsappUrl }: ProductGridProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [panelIdx, setPanelIdx] = useState<number | null>(null);
  const [panelProduct, setPanelProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [cols, setCols] = useState(2);

  const prevActiveIdx = useRef<number | null>(null);

  // Monitor window resize to dynamically calculate grid columns
  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 768) {
        setCols(3);
      } else {
        setCols(2);
      }
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  // Handle panel opening, closing, and transitions between different rows
  useEffect(() => {
    if (activeIdx === prevActiveIdx.current) return;
    prevActiveIdx.current = activeIdx;

    if (activeIdx !== null) {
      const product = products[activeIdx];
      if (isOpen && panelIdx !== null) {
        const currentInsertion = Math.min(
          products.length - 1,
          Math.floor(panelIdx / cols) * cols + (cols - 1)
        );
        const newInsertion = Math.min(
          products.length - 1,
          Math.floor(activeIdx / cols) * cols + (cols - 1)
        );

        if (currentInsertion === newInsertion) {
          // Same row: update content immediately without closing
          setPanelProduct(product);
          setPanelIdx(activeIdx);
        } else {
          // Different row: collapse first, then open at new position
          setIsOpen(false);
          const timer = setTimeout(() => {
            setPanelProduct(product);
            setPanelIdx(activeIdx);
            setIsOpen(true);
          }, 500);
          return () => clearTimeout(timer);
        }
      } else {
        // Closed: open immediately
        setPanelProduct(product);
        setPanelIdx(activeIdx);
        setIsOpen(true);
      }
    } else {
      // Closing panel
      setIsOpen(false);
      const timer = setTimeout(() => {
        setPanelProduct(null);
        setPanelIdx(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeIdx, products, cols, isOpen, panelIdx]);

  // Local helper for price formatting: ≥1_000_000 -> "IDR X.YM" else "IDR NNNK"
  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      const millions = price / 1000000;
      return `IDR ${millions.toFixed(1).replace(/\.0$/, "")}M`;
    }
    return `IDR ${price / 1000}K`;
  };

  // Determine where to insert the full-width panel in the grid flow
  const insertionIndex =
    panelIdx !== null
      ? Math.min(products.length - 1, Math.floor(panelIdx / cols) * cols + (cols - 1))
      : null;

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
        {products.map((product, index) => {
          const isSelected = activeIdx === index;
          const showPanelHere = insertionIndex === index && panelProduct !== null;

          return (
            <React.Fragment key={product.id}>
              <button
                type="button"
                onClick={() => setActiveIdx(isSelected ? null : index)}
                aria-expanded={isSelected}
                aria-controls={isSelected ? `detail-panel-${product.id}` : undefined}
                className="w-full text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-clay group cursor-pointer"
              >
                {/* Image Frame */}
                <div className="bg-linen aspect-square p-6 md:p-8 flex items-center justify-center overflow-hidden relative">
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-ink-soft font-body">
                    {product.category}
                  </span>
                  <h3 className="font-display text-lg md:text-xl text-ink mt-1">
                    {product.name}
                  </h3>
                  <span className="text-sm font-body text-ink mt-1">
                    {formatPrice(product.priceIdr)}
                  </span>
                </div>
              </button>

              {/* Detail Panel */}
              {showPanelHere && (
                <div
                  id={`detail-panel-${panelProduct.id}`}
                  className="col-span-2 md:col-span-3 overflow-hidden grid transition-[grid-template-rows] duration-500 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="bg-linen p-8 md:p-12 my-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative border border-ink/5">
                      {/* Close Button */}
                      <button
                        type="button"
                        onClick={() => setActiveIdx(null)}
                        className="absolute top-6 right-6 text-ink-soft hover:text-ink transition-colors cursor-pointer p-2"
                        aria-label="Close details"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      {/* Large Image Frame */}
                      <div className="relative aspect-square md:aspect-[4/3] bg-bone overflow-hidden">
                        <Image
                          src={panelProduct.image}
                          alt={panelProduct.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col justify-center">
                        <span className="text-xs uppercase tracking-widest text-ink-soft font-body mb-2">
                          {panelProduct.category}
                        </span>
                        <h3 className="font-display text-2xl md:text-3xl text-ink mb-3">
                          {panelProduct.name}
                        </h3>
                        <p className="font-body text-base text-ink-soft leading-relaxed mb-6">
                          {panelProduct.description}
                        </p>
                        <div className="text-lg font-body text-ink mb-6">
                          {formatPrice(panelProduct.priceIdr)}
                        </div>
                        <div>
                          <a
                            href={`${whatsappUrl}?text=${encodeURIComponent(
                              `Hello Yabhasyuka, I would like to inquire about the ${panelProduct.name} (${formatPrice(panelProduct.priceIdr)}).`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-ink text-bone rounded-full px-7 py-3.5 hover:bg-clay transition-colors font-body text-sm font-medium"
                          >
                            Ask about this product
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Note at the bottom */}
      <div className="mt-16 text-center">
        <p className="text-ink-soft text-sm font-body">
          Online purchase is coming soon — products are available at the spa.
        </p>
      </div>
    </div>
  );
}
