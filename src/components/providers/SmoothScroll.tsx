"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll with mobile-aware native touch handling
    const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    const lenis = new Lenis({
      duration: isMobile ? 0.6 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.0,
      syncTouch: false, // Let native compositor handle touch scrolling at 120Hz on mobile
      autoResize: true,
      // @ts-ignore
      naiveDimensions: true, // Continuously compute live scrollHeight - clientHeight so scroll never gets locked
      // @ts-ignore
      __experimental__naiveDimensions: true,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Expose Lenis instance globally for synchronized components (e.g. global scroll capsule)
    if (typeof window !== "undefined") {
      (window as any).__lenis = lenis;
    }

    // Dynamic height observer: Automatically recomputes scroll limit whenever category changes or images load
    let resizeTimer: NodeJS.Timeout;
    const handleRecalculate = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    const resizeObserver = new ResizeObserver(() => {
      handleRecalculate();
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleRecalculate, 150);
    });

    if (typeof document !== "undefined" && document.body) {
      resizeObserver.observe(document.body);
    }
    window.addEventListener("resize", handleRecalculate);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleRecalculate);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      if (typeof window !== "undefined") {
        delete (window as any).__lenis;
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
