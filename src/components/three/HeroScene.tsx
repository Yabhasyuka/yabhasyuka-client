"use client";

import React, { useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { SilkForm } from "./SilkForm";
import { useMediaQuery } from "@/lib/useMediaQuery";

interface HeroSceneProps {
  className?: string;
}

let webglChecked = false;
let webglAvailable = false;
function checkWebGLAvailability(): boolean {
  if (webglChecked) return webglAvailable;
  webglChecked = true;
  try {
    const canvas = document.createElement("canvas");
    webglAvailable = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl") ||
        canvas.getContext("webgl2"))
    );
  } catch {
    webglAvailable = false;
  }
  return webglAvailable;
}

const noopSubscribe = () => () => {};

export default function HeroScene({ className }: HeroSceneProps) {
  // SSR renders null; client hydrates then flips on — no mismatch, no setState-in-effect
  const webglOk = useSyncExternalStore(
    noopSubscribe,
    checkWebGLAvailability,
    () => false
  );
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)", true);

  if (!webglOk || reduced) {
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
