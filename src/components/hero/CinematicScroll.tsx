"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VehicleCanvas from "@/components/canvas/VehicleCanvas";
import { VEHICLES } from "@/data/vehicles";
import { soundManager } from "@/lib/audio";
import { ChevronDown } from "lucide-react";

interface CinematicScrollProps {
  scrollProgressRef?: React.RefObject<number>;
}

export default function CinematicScroll({
  scrollProgressRef: externalProgressRef,
}: CinematicScrollProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Scene scroll progress stored in ref to eliminate React re-renders on scroll
  const internalProgressRef = useRef(0);
  const scrollProgressRef = externalProgressRef || internalProgressRef;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const runwayDistance = isMobile ? 700 : 750; // Calibrated to 1/3 of previous distance

    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: `+=${runwayDistance}`,
      pin: containerRef.current,
      anticipatePin: 1,
      // scrub: true provides 1:1 instantaneous lockstep with finger scroll (0ms delay)
      scrub: true,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const handleNavigateSection = (targetProgress: number) => {
    if (!triggerRef.current) return;
    const triggerTop = triggerRef.current.offsetTop;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const runwayDistance = isMobile ? 700 : 750;

    window.scrollTo({
      top: triggerTop + targetProgress * runwayDistance,
      behavior: "smooth",
    });
  };

  const currentVehicle = VEHICLES[0];

  return (
    <section ref={triggerRef} className="relative w-full">
      {/* Pinned Viewport Container */}
      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between select-none"
      >
        {/* ------------------------------------------------------------------ */}
        {/* TRUE REAL-TIME 3D WEBGL ENGINE (Rendered behind typography)        */}
        {/* ------------------------------------------------------------------ */}
        <VehicleCanvas scrollProgressRef={scrollProgressRef} />

        {/* Soft Studio Overhead Light Diffusion Overlay */}
        <div className="absolute top-0 left-0 right-0 h-52 sm:h-60 md:h-64 bg-gradient-to-b from-[#F6F6F8]/90 via-[#F6F6F8]/50 to-transparent dark:from-[#0B0B0D]/90 dark:via-[#0B0B0D]/50 dark:to-transparent pointer-events-none z-10" />

        {/* ------------------------------------------------------------------ */}
        {/* MAIN TYPOGRAPHY & UI OVERLAY: Positioned in front of 3D Canvas     */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative z-20 w-full h-full flex flex-col justify-between pt-20 sm:pt-24 md:pt-28 pb-6 sm:pb-8 md:pb-12 px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 pointer-events-none">
          {/* Compact Welcome Heading (Architecturally Flanking the 3D Halo Ring) */}
          <div className="w-full flex items-start justify-start md:my-auto">
            <div
              dir="ltr"
              className="w-fit max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md text-left overflow-visible select-text"
            >
              {/* Scene Counter & Porsche Red Accent */}
              <div className="flex items-center gap-2 mb-2 text-[9px] sm:text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 dark:text-neutral-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D5001C] shrink-0" />
                <span className="text-neutral-900 dark:text-white font-semibold font-mono">
                  {currentVehicle.index}
                </span>
                <span className="font-mono">/</span>
                <span className="font-mono">01</span>
              </div>

              {/* Compact Hero Main Heading: THE / PORSCHE / IRAN 3-line stack */}
              <h1 className="select-text uppercase leading-none font-syncopate inline-flex flex-col">
                <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] sm:tracking-[0.3em] text-neutral-400 dark:text-neutral-500 font-normal mb-2 sm:mb-2.5">
                  WELCOME TO
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[44px] font-bold tracking-[0.06em] sm:tracking-[0.08em] text-neutral-950 dark:text-white leading-[1.08] whitespace-nowrap">
                  THE
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[44px] font-bold tracking-[0.06em] sm:tracking-[0.08em] text-neutral-950 dark:text-white leading-[1.08] whitespace-nowrap mt-0.5 sm:mt-1">
                  PORSCHE
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[44px] font-extrabold tracking-[0.08em] sm:tracking-[0.12em] leading-[1.08] whitespace-nowrap mt-0.5 sm:mt-1">
                  <span className="iran-flag-text">IRAN</span>
                </span>
              </h1>
            </div>
          </div>

          {/* Bottom Row: Left Dynamic Counter & Right "SCROLL TO EXPLORE" */}
          <div className="flex items-end justify-between w-full pointer-events-auto gap-2">
            {/* Bottom Left: Quick Model Indicator */}
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-neutral-900 dark:text-white font-mono">
                {currentVehicle.index}
              </span>
            </div>

            {/* Bottom Right: SCROLL TO EXPLORE with animated downward indicator */}
            <button
              onClick={() => {
                soundManager.playClick();
                const storeEl = document.getElementById("boutique-store");
                if (storeEl) {
                  storeEl.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="flex items-center space-x-2 sm:space-x-3 text-[8px] sm:text-[10px] font-medium tracking-[0.25em] sm:tracking-[0.3em] text-neutral-700 dark:text-neutral-300 uppercase cursor-pointer group hover:text-black dark:hover:text-white transition-colors shrink-0"
            >
              <span className="hidden sm:inline">SCROLL</span>
              <div className="w-6 h-6 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center group-hover:border-black dark:group-hover:border-white transition-colors">
                <ChevronDown className="w-3 h-3 text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white animate-subtle-pulse" />
              </div>
            </button>
          </div>
        </div>

        {/* 1px Architectural Physical Separation Layer */}
        <div className="arch-separator z-30" />
      </div>
    </section>
  );
}
