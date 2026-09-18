"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

interface HeroScrollCapsuleProps {
  scrollProgressRef?: React.RefObject<number>;
  onNavigateSection?: (progress: number) => void;
}

const TRACK_TICKS = [0.25, 0.5, 0.75];

export default function HeroScrollCapsule({}: HeroScrollCapsuleProps = {}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const carIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCapsulePosition = () => {
      const track = trackRef.current;
      const car = carIndicatorRef.current;
      if (!track || !car) return;

      // 1. Calculate global page scroll progress (0 at top of site, 1 at bottom of site)
      const lenis = typeof window !== "undefined" ? (window as any).__lenis : null;
      const scrollY =
        lenis && typeof lenis.scroll === "number"
          ? lenis.scroll
          : typeof window !== "undefined"
          ? window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
          : 0;
      const maxScroll =
        typeof document !== "undefined"
          ? Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
          : 1;
      const p = Math.max(0, Math.min(1, scrollY / maxScroll));

      // Calculate vertical travel bounds inside the pill
      const trackHeight = track.clientHeight;
      const carHeight = car.clientHeight;
      const verticalPadding = 8; // Top/bottom padding
      const maxTravel = Math.max(0, trackHeight - carHeight - verticalPadding * 2);

      // Direct GPU-accelerated transform: 120 FPS, 0 React re-renders on scroll
      const travelY = verticalPadding + p * maxTravel;
      car.style.transform = `translate3d(-50%, ${travelY}px, 0)`;
    };

    // Attach to the shared GSAP master ticker for 1:1 instantaneous lockstep with 3D GT3
    gsap.ticker.add(updateCapsulePosition);

    return () => {
      gsap.ticker.remove(updateCapsulePosition);
    };
  }, []);

  return (
    <div className="fixed right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 pointer-events-none select-none">
      {/* CAPSULE TRACK CONTAINER */}
      <div
        ref={trackRef}
        className="relative w-[26px] sm:w-[30px] md:w-[34px] h-[230px] sm:h-[280px] md:h-[320px] rounded-full 
                   bg-black/[0.25] dark:bg-black/[0.55] backdrop-blur-md 
                   border border-neutral-300/50 dark:border-white/[0.14] 
                   shadow-[inset_0_0_12px_rgba(255,255,255,0.06),0_8px_32px_rgba(0,0,0,0.25)] 
                   overflow-hidden flex justify-center"
      >
        {/* Subtle Central Architectural Guide Rail Line */}
        <div className="absolute top-3 bottom-3 left-1/2 -translate-x-1/2 w-[1px] bg-neutral-400/30 dark:bg-white/[0.12]" />

        {/* Milestone Tick Marks on Track */}
        {TRACK_TICKS.map((pos) => (
          <div
            key={`tick-${pos}`}
            className="absolute left-1/2 -translate-x-1/2 w-2 h-[1px] bg-neutral-400/40 dark:bg-white/[0.20]"
            style={{ top: `${pos * 100}%` }}
          />
        ))}

        {/* GT3 MINIATURE VEHICLE TRAVEL INDICATOR */}
        <div
          ref={carIndicatorRef}
          className="absolute left-1/2 top-0 will-change-transform pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          style={{ transform: "translate3d(-50%, 8px, 0)" }}
        >
          {/* Miniature 911 GT3 RS Top-Down Cutout */}
          <div className="relative w-[18px] sm:w-[22px] md:w-[24px] aspect-[229/501]">
            <Image
              src="/images/gt3-topdown.png"
              alt="Porsche 911 GT3 RS Indicator"
              fill
              sizes="32px"
              priority
              className="object-contain filter brightness-[1.08] contrast-[1.05]"
            />

            {/* Subtle Porsche Racing Red apex taillight indicator at rear */}
            <div className="absolute top-[-1px] left-1/2 -translate-x-1/2 w-2 h-[1.5px] bg-[#D5001C] rounded-full shadow-[0_0_4px_#D5001C]" />

            {/* Subtle Headlight Beams illuminating forward travel down track */}
            <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 flex justify-between w-full px-[3px]">
              <div className="w-[2px] h-[3px] bg-sky-200/80 rounded-full blur-[0.5px]" />
              <div className="w-[2px] h-[3px] bg-sky-200/80 rounded-full blur-[0.5px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
