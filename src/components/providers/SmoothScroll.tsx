"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Detect Safari / WebKit (macOS Safari & iOS Safari/Chrome/WebKit)
    const isSafari =
      typeof window !== "undefined" &&
      (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
       /iPad|iPhone|iPod/.test(navigator.userAgent) ||
       (Boolean(navigator.vendor) && navigator.vendor.includes("Apple") && !navigator.userAgent.includes("Chrome")));

    // Safari / iOS has hardware-accelerated 120Hz CoreAnimation momentum scrolling.
    // Bypassing Lenis on Safari eliminates synchronous window.scrollTo layout stalls in WebKit.
    if (isSafari) {
      const onSafariScroll = () => {
        ScrollTrigger.update();
      };
      window.addEventListener("scroll", onSafariScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", onSafariScroll);
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }

    // Chrome / other browsers continue using Lenis exactly as before
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const lenis = new Lenis({
      duration: isMobile ? 0.6 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.0,
      syncTouch: false,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
