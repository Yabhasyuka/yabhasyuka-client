"use client";

import React, { createContext, useContext, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type TransitionContextType = {
  navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextType | null>(null);

export function useTransitionRouter(): TransitionContextType {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransitionRouter must be used within a TransitionProvider");
  }
  return context;
}

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const overlayRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);
  const prevPathname = useRef(pathname);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useGSAP(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { yPercent: 100 });
    }
  }, []);

  const clearSafetyTimer = () => {
    if (safetyTimer.current) {
      clearTimeout(safetyTimer.current);
      safetyTimer.current = null;
    }
  };

  const navigate = useCallback(
    (href: string) => {
      if (typeof window === "undefined") return;

      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }

      const isAnchorOnCurrentPage =
        href.startsWith("#") || (href.startsWith("/#") && pathname === "/");

      if (isAnchorOnCurrentPage) {
        const targetId = href.startsWith("#") ? href : href.slice(1);
        const element = document.querySelector(targetId);
        if (lenis && element) {
          lenis.scrollTo(element as HTMLElement);
        } else if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }

      if (href === pathname || href === `${pathname}/`) {
        if (lenis) {
          lenis.scrollTo(0, { duration: 1 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      if (isTransitioning.current) return;

      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isReduced) {
        router.push(href);
        return;
      }

      if (!overlayRef.current) {
        router.push(href);
        return;
      }

      isTransitioning.current = true;
      clearSafetyTimer();

      safetyTimer.current = setTimeout(() => {
        if (isTransitioning.current && overlayRef.current) {
          gsap.to(overlayRef.current, {
            yPercent: -100,
            duration: 0.7,
            onComplete: () => {
              gsap.set(overlayRef.current, { yPercent: 100 });
              isTransitioning.current = false;
            },
          });
        }
      }, 3500);

      gsap.to(overlayRef.current, {
        yPercent: 0,
        duration: 0.55,
        ease: "power3.inOut",
        onComplete: () => {
          router.push(href);
        },
      });
    },
    [pathname, router, lenis]
  );

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;

      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }

      if (window.location.hash) {
        const el = document.querySelector(window.location.hash);
        if (el) {
          if (lenis) {
            lenis.scrollTo(el as HTMLElement, { immediate: true });
          } else {
            el.scrollIntoView();
          }
        }
      }

      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isReduced) {
        isTransitioning.current = false;
        clearSafetyTimer();
        return;
      }

      if (isTransitioning.current && overlayRef.current) {
        clearSafetyTimer();
        gsap.to(overlayRef.current, {
          yPercent: -100,
          duration: 0.7,
          delay: 0.1,
          ease: "power3.inOut",
          onComplete: () => {
            if (overlayRef.current) {
              gsap.set(overlayRef.current, { yPercent: 100 });
            }
            isTransitioning.current = false;
          },
        });
      }
    }
  }, [pathname, lenis]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[95] bg-bone flex items-center justify-center pointer-events-none"
        style={{ transform: "translate3d(0, 100%, 0)" }}
      >
        <span className="font-display text-4xl md:text-6xl tracking-widest text-ink/20 uppercase select-none">
          Yabhasyuka
        </span>
      </div>
    </TransitionContext.Provider>
  );
}
