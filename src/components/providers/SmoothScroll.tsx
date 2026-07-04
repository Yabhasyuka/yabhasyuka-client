"use client";

import React, { useRef } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { ReactLenis, LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const isReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const lenisRef = useRef<LenisRef>(null);

  useGSAP(() => {
    if (isReduced) return;

    let scrollListenerAttached = false;
    const attachScroll = () => {
      const lenis = lenisRef.current?.lenis;
      if (lenis && !scrollListenerAttached) {
        lenis.on("scroll", ScrollTrigger.update);
        scrollListenerAttached = true;
      }
    };

    attachScroll();

    const onTicker = (time: number) => {
      attachScroll();
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(onTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (lenisRef.current?.lenis && scrollListenerAttached) {
        lenisRef.current.lenis.off("scroll", ScrollTrigger.update);
      }
      gsap.ticker.remove(onTicker);
    };
  }, [isReduced]);

  if (isReduced) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ lerp: 0.09, smoothWheel: true, autoRaf: false }}
      autoRaf={false}
    >
      {children}
    </ReactLenis>
  );
}
