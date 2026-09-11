"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VehicleCanvas from "@/components/canvas/VehicleCanvas";
import { VEHICLES } from "@/data/vehicles";
import { soundManager } from "@/lib/audio";
import { ChevronDown } from "lucide-react";

export default function CinematicScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Scene scroll progress stored in ref to eliminate React re-renders on scroll
  const scrollProgressRef = useRef(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: "+=2800", // Generous cinematic scroll runway
      pin: containerRef.current,
      anticipatePin: 1,
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;
        scrollProgressRef.current = p;

        // Only update active index state when the model boundary actually changes
        const nextIndex = p < 0.50 ? 0 : 1;
        setActiveSceneIndex((prev) => (prev !== nextIndex ? nextIndex : prev));
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const scrollToScene = (index: number) => {
    soundManager.playClick();
    if (!triggerRef.current) return;
    const triggerTop = triggerRef.current.offsetTop;
    const totalDistance = 2800;
    const sceneTargets = [0, 0.70];
    const targetScroll = triggerTop + totalDistance * sceneTargets[index];

    // Trigger synthetic audio rev for the vehicle
    const modelKeys: ("macan" | "boxster")[] = ["macan", "boxster"];
    soundManager.playEngineRev(modelKeys[index]);

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const currentVehicle = VEHICLES[activeSceneIndex] || VEHICLES[0];

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
        <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#F6F6F8]/80 to-transparent pointer-events-none z-10" />

        {/* ------------------------------------------------------------------ */}
        {/* MAIN TYPOGRAPHY & UI OVERLAY: Positioned in front of 3D Canvas     */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative z-20 w-full h-full flex flex-col justify-between pt-20 sm:pt-28 md:pt-36 pb-6 sm:pb-8 md:pb-12 px-4 sm:px-10 md:px-16 pointer-events-none">
          {/* Top Row: Left Hero Copy & Right Scene Jump Markers */}
          <div className="flex items-start justify-between w-full">
            {/* LEFT: Typography & Specs */}
            <div className="max-w-xl">
              {/* Scene Counter */}
              <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400 mb-2 sm:mb-3 flex items-center gap-2">
                <span className="text-neutral-900 font-semibold">{currentVehicle.index}</span>
                <span>/</span>
                <span>02</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D5001C] ml-1" />
              </div>

              {/* Dynamic Vehicle Model Name */}
              <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase text-neutral-800 mb-0.5 sm:mb-1">
                {currentVehicle.name}
              </div>

              {/* Hero Main Heading */}
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-light tracking-[0.12em] sm:tracking-[0.14em] text-neutral-900 uppercase leading-[1.08]">
                DRIVEN
                <br />
                <span className="font-semibold tracking-[0.14em] sm:tracking-[0.16em]">BY MORE</span>
                <br />
                <span className="text-base sm:text-2xl md:text-3xl font-light tracking-[0.18em] sm:tracking-[0.2em] text-neutral-500">
                  THAN ROADS
                </span>
              </h1>

              {/* Supporting Text (Shown on sm+ to prevent crowding 3D car on small mobile phones) */}
              <p className="hidden sm:block mt-3 sm:mt-5 text-[9px] sm:text-[10px] md:text-[11px] font-medium tracking-[0.28em] text-neutral-500 uppercase leading-relaxed max-w-xs">
                {currentVehicle.tagline}
              </p>

              {/* Dynamic Vehicle Specifications */}
              <div className="mt-3 sm:mt-6 md:mt-8 flex items-center space-x-3 sm:space-x-6 text-[8px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.18em] uppercase text-neutral-400 font-mono transition-opacity duration-500">
                <div>
                  <span className="text-neutral-900 font-medium">{currentVehicle.specs.power}</span>
                  <span className="block text-[6.5px] sm:text-[8px] text-neutral-400">OUTPUT</span>
                </div>
                <div className="w-[1px] h-3.5 sm:h-5 bg-neutral-200" />
                <div>
                  <span className="text-neutral-900 font-medium">{currentVehicle.specs.acceleration}</span>
                  <span className="block text-[6.5px] sm:text-[8px] text-neutral-400">0–60 MPH</span>
                </div>
                <div className="w-[1px] h-3.5 sm:h-5 bg-neutral-200" />
                <div>
                  <span className="text-neutral-900 font-medium">{currentVehicle.specs.topSpeed}</span>
                  <span className="block text-[6.5px] sm:text-[8px] text-neutral-400">TOP SPEED</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Scene Markers (01 MACAN, 02 BOXSTER, 03 911) */}
            <div className="hidden lg:flex flex-col items-end space-y-4 pointer-events-auto">
              <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-neutral-400 mb-1">
                3D SCENARIO INDEX
              </span>

              {VEHICLES.map((v, idx) => {
                const isActive = activeSceneIndex === idx;
                return (
                  <button
                    key={v.id}
                    onClick={() => scrollToScene(idx)}
                    className={`flex items-center gap-3 text-right text-[10px] font-mono tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer group ${
                      isActive
                        ? "text-neutral-950 font-bold"
                        : "text-neutral-400 hover:text-neutral-800"
                    }`}
                  >
                    <span className="text-[9px] text-neutral-400 group-hover:text-black">
                      {v.index}
                    </span>
                    <span>{v.modelCode}</span>
                    <span
                      className={`h-[1.5px] transition-all duration-300 ${
                        isActive
                          ? "w-8 bg-neutral-950"
                          : "w-3 bg-neutral-300 group-hover:w-5 group-hover:bg-neutral-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Row: Left Dynamic Counter & Right "SCROLL TO EXPLORE" */}
          <div className="flex items-end justify-between w-full pointer-events-auto gap-2">
            {/* Bottom Left: Quick Model Switcher */}
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-neutral-900 font-mono">
                {currentVehicle.index}
              </span>
              <div className="flex flex-col text-[7px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 uppercase font-mono">
                <span className="text-neutral-800 font-semibold">{currentVehicle.name}</span>
                <span className="hidden sm:inline">REAL-TIME 3D WEBGL</span>
              </div>
            </div>

            {/* Mobile Scene Jump Buttons (Touch-friendly tap targets) */}
            <div className="flex lg:hidden items-center space-x-1 bg-white/90 backdrop-blur-md p-1 rounded-full border border-black/[0.08] shadow-sm">
              {VEHICLES.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => scrollToScene(i)}
                  className={`text-[8px] sm:text-[9px] tracking-[0.16em] uppercase px-2.5 py-1.5 rounded-full transition-all cursor-pointer min-h-[32px] flex items-center justify-center ${
                    activeSceneIndex === i
                      ? "bg-neutral-900 text-white font-medium shadow-xs"
                      : "text-neutral-600 hover:text-black active:bg-neutral-200"
                  }`}
                >
                  {v.modelCode}
                </button>
              ))}
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
              className="flex items-center space-x-2 sm:space-x-3 text-[8px] sm:text-[10px] font-medium tracking-[0.25em] sm:tracking-[0.3em] text-neutral-700 uppercase cursor-pointer group hover:text-black transition-colors shrink-0"
            >
              <span className="hidden sm:inline">SCROLL</span>
              <div className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center group-hover:border-black transition-colors">
                <ChevronDown className="w-3 h-3 text-neutral-700 group-hover:text-black animate-subtle-pulse" />
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
