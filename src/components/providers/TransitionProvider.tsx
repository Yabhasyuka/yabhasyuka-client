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
  const textRef = useRef<HTMLSpanElement>(null);
  const isTransitioning = useRef(false);
  const prevPathname = useRef(pathname);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 110 (not 100) so the curved lips extending past the panel stay off-screen at rest
  const HIDDEN_BELOW = 110;
  const HIDDEN_ABOVE = -110;

  useGSAP(() => {
    if (overlayRef.current) {
      // y: 0 clears the px offset GSAP parses from the SSR inline transform
      gsap.set(overlayRef.current, { y: 0, yPercent: HIDDEN_BELOW });
    }
  }, []);

  const resetOverlay = () => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { y: 0, yPercent: HIDDEN_BELOW });
    }
    if (textRef.current) {
      gsap.set(textRef.current, { opacity: 0, y: 24 });
    }
    isTransitioning.current = false;
  };

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
            yPercent: HIDDEN_ABOVE,
            duration: 0.9,
            ease: "power4.inOut",
            onComplete: resetOverlay,
          });
        }
      }, 3500);

      const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });
      tl.to(overlayRef.current, { yPercent: 0, duration: 0.9 });
      if (textRef.current) {
        tl.fromTo(
          textRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.45"
        );
      }
      tl.call(() => router.push(href));
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
        const tl = gsap.timeline({ delay: 0.15, onComplete: resetOverlay });
        if (textRef.current) {
          tl.to(textRef.current, {
            opacity: 0,
            y: -24,
            duration: 0.4,
            ease: "power2.in",
          });
        }
        tl.to(
          overlayRef.current,
          { yPercent: HIDDEN_ABOVE, duration: 0.9, ease: "power4.inOut" },
          "-=0.25"
        );
      }
    }
  }, [pathname, lenis]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[95] pointer-events-none"
        style={{ transform: "translate3d(0, 110%, 0)" }}
      >
        {/* curved lip leading the panel as it sweeps up */}
        <div
          className="absolute left-[-10%] right-[-10%] h-[10vh] bg-bone"
          style={{ top: "calc(-10vh + 1px)", borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
        />
        <div className="absolute inset-0 bg-bone" />
        {/* curved lip trailing the panel as it exits */}
        <div
          className="absolute left-[-10%] right-[-10%] h-[10vh] bg-bone"
          style={{ bottom: "calc(-10vh + 1px)", borderRadius: "0 0 50% 50% / 0 0 100% 100%" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            ref={textRef}
            className="font-display text-4xl md:text-6xl tracking-widest text-ink/20 uppercase select-none opacity-0"
          >
            Yabhasyuka
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
