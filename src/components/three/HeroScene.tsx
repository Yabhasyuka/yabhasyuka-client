"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { SilkForm } from "./SilkForm";

interface HeroSceneProps {
  className?: string;
}

function checkWebGLAvailability(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl") ||
        canvas.getContext("webgl2"))
    );
  } catch {
    return false;
  }
}

export default function HeroScene({ className }: HeroSceneProps) {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (!checkWebGLAvailability()) {
      setCanRender(false);
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateRenderState = (matches: boolean) => {
      setCanRender(!matches);
    };

    updateRenderState(mediaQuery.matches);

    const handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
      updateRenderState("matches" in event ? event.matches : mediaQuery.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange as (e: MediaQueryListEvent) => void);
      return () => {
        mediaQuery.removeEventListener("change", handleMediaChange as (e: MediaQueryListEvent) => void);
      };
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMediaChange as (e: MediaQueryListEvent) => void);
      return () => {
        mediaQuery.removeListener(handleMediaChange as (e: MediaQueryListEvent) => void);
      };
    }
  }, []);

  if (!canRender) {
    return null;
  }

  return (
    <Canvas
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 40 }}
    >
      <ambientLight intensity={0.4} color="#efe7db" />
      <directionalLight position={[4, 5, 4]} intensity={1.5} color="#f5e9da" />
      <directionalLight position={[-4, -3, 2]} intensity={0.8} color="#b08968" />
      <SilkForm />
    </Canvas>
  );
}
