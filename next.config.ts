import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phones on the local network to load dev-server assets (otherwise
  // Next blocks cross-origin dev requests and the page never hydrates —
  // no GSAP, no clicks). Dev-only; no effect on production builds.
  allowedDevOrigins: ["192.168.0.*"],
};

export default nextConfig;
