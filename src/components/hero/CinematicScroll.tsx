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
        <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#F6F6F8]/80 dark:from-[#0B0B0D]/80 to-transparent pointer-events-none z-10" />

        {/* ------------------------------------------------------------------ */}
        {/* MAIN TYPOGRAPHY & UI OVERLAY: Positioned in front of 3D Canvas     */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative z-20 w-full h-full flex flex-col justify-between pt-20 sm:pt-28 md:pt-36 pb-6 sm:pb-8 md:pb-12 px-4 sm:px-10 md:px-16 pointer-events-none">
          {/* Top Row: Left Hero Copy & Right Scene Jump Markers */}
          <div className="flex items-start justify-between w-full">
            {/* LEFT: Typography */}
            <div className="max-w-xl">
              {/* Scene Counter */}
              <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-500 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-neutral-900 dark:text-white font-semibold">{currentVehicle.index}</span>
                <span>/</span>
                <span>01</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D5001C] ml-1" />
              </div>

              {/* Hero Main Heading */}
              <h1
                lang="fa"
                dir="rtl"
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-neutral-950 dark:text-white font-sans leading-[1.25] inline-block"
                style={{ letterSpacing: "normal" }}
              >
                به پورشه ایران خوش آمدید
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
