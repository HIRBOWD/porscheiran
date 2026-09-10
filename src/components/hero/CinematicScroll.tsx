"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VehicleCanvas from "@/components/canvas/VehicleCanvas";
import SketchfabPorscheMacan from "./SketchfabPorscheMacan";
import SketchfabPorscheBoxster from "./SketchfabPorscheBoxster";
import SketchfabPorsche911 from "./SketchfabPorsche911";
import { VEHICLES } from "@/data/vehicles";
import { soundManager } from "@/lib/audio";
import { ChevronDown } from "lucide-react";

export default function CinematicScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Scene scroll progress (0 to 1)
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: "+=3400", // Generous cinematic scroll runway
      pin: containerRef.current,
      anticipatePin: 1,
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);

        // Update active index based on scroll position
        if (p < 0.33) {
          setActiveSceneIndex(0);
        } else if (p >= 0.33 && p < 0.66) {
          setActiveSceneIndex(1);
        } else {
          setActiveSceneIndex(2);
        }
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
    const totalDistance = 3400;
    const sceneTargets = [0, 0.44, 0.78];
    const targetScroll = triggerTop + totalDistance * sceneTargets[index];

    // Trigger synthetic audio rev for the vehicle
    const modelKeys: ("macan" | "boxster" | "911")[] = ["macan", "boxster", "911"];
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
        <VehicleCanvas scrollProgress={scrollProgress} />

        {/* ------------------------------------------------------------------ */}
        {/* VEHICLE 01: REAL-TIME SKETCHFAB 3D MACAN GTS                       */}
        {/* ------------------------------------------------------------------ */}
        <SketchfabPorscheMacan
          scrollProgress={scrollProgress}
          isVisible={scrollProgress <= 0.36}
        />

        {/* ------------------------------------------------------------------ */}
        {/* VEHICLE 02: REAL-TIME SKETCHFAB 3D 718 BOXSTER GTS                 */}
        {/* ------------------------------------------------------------------ */}
        <SketchfabPorscheBoxster
          scrollProgress={scrollProgress}
          isVisible={scrollProgress >= 0.18 && scrollProgress <= 0.70}
        />

        {/* ------------------------------------------------------------------ */}
        {/* VEHICLE 03: REAL-TIME SKETCHFAB 3D 911 CARRERA 4S                  */}
        {/* ------------------------------------------------------------------ */}
        <SketchfabPorsche911
          scrollProgress={scrollProgress}
          isVisible={scrollProgress >= 0.52}
        />

        {/* Soft Studio Overhead Light Diffusion Overlay */}
        <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-[#F6F6F8]/80 to-transparent pointer-events-none z-10" />

        {/* ------------------------------------------------------------------ */}
        {/* MAIN TYPOGRAPHY & UI OVERLAY: Positioned in front of 3D Canvas     */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative z-20 w-full h-full flex flex-col justify-between pt-28 md:pt-36 pb-8 md:pb-12 px-6 sm:px-10 md:px-16 pointer-events-none">
          {/* Top Row: Left Hero Copy & Right Scene Jump Markers */}
          <div className="flex items-start justify-between w-full">
            {/* LEFT: Typography & Specs */}
            <div className="max-w-xl">
              {/* Scene Counter */}
              <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400 mb-3 flex items-center gap-2">
                <span className="text-neutral-900 font-semibold">{currentVehicle.index}</span>
                <span>/</span>
                <span>03</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D5001C] ml-1" />
              </div>

              {/* Dynamic Vehicle Model Name */}
              <div className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-neutral-800 mb-1">
                {currentVehicle.name}
              </div>

              {/* Hero Main Heading */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.14em] text-neutral-900 uppercase leading-[1.08]">
                DRIVEN
                <br />
                <span className="font-semibold tracking-[0.16em]">BY MORE</span>
                <br />
                <span className="text-lg sm:text-2xl md:text-3xl font-light tracking-[0.2em] text-neutral-500">
                  THAN ROADS
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="mt-3 sm:mt-5 text-[9px] sm:text-[10px] md:text-[11px] font-medium tracking-[0.28em] text-neutral-500 uppercase leading-relaxed max-w-xs">
                {currentVehicle.tagline}
              </p>

              {/* Dynamic Vehicle Specifications */}
              <div className="mt-6 sm:mt-8 flex items-center space-x-4 sm:space-x-6 text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-neutral-400 font-mono transition-opacity duration-500">
                <div>
                  <span className="text-neutral-900 font-medium">{currentVehicle.specs.power}</span>
                  <span className="block text-[7px] sm:text-[8px] text-neutral-400">OUTPUT</span>
                </div>
                <div className="w-[1px] h-4 sm:h-5 bg-neutral-200" />
                <div>
                  <span className="text-neutral-900 font-medium">{currentVehicle.specs.acceleration}</span>
                  <span className="block text-[7px] sm:text-[8px] text-neutral-400">0–60 MPH</span>
                </div>
                <div className="w-[1px] h-4 sm:h-5 bg-neutral-200" />
                <div>
                  <span className="text-neutral-900 font-medium">{currentVehicle.specs.topSpeed}</span>
                  <span className="block text-[7px] sm:text-[8px] text-neutral-400">TOP SPEED</span>
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
          <div className="flex items-end justify-between w-full pointer-events-auto">
            {/* Bottom Left: Quick Model Switcher */}
            <div className="flex items-center gap-4">
              <span className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-neutral-900 font-mono">
                {currentVehicle.index}
              </span>
              <div className="flex flex-col text-[8px] sm:text-[9px] tracking-[0.25em] text-neutral-400 uppercase font-mono">
                <span className="text-neutral-800 font-semibold">{currentVehicle.name}</span>
                <span>REAL-TIME 3D WEBGL</span>
              </div>
            </div>

            {/* Mobile Scene Jump Buttons */}
            <div className="flex lg:hidden items-center space-x-1 bg-white/80 backdrop-blur-md px-2 py-1 rounded-full border border-black/[0.06] shadow-sm">
              {VEHICLES.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => scrollToScene(i)}
                  className={`text-[8px] tracking-[0.18em] uppercase px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                    activeSceneIndex === i
                      ? "bg-neutral-900 text-white font-medium"
                      : "text-neutral-500 hover:text-black"
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
              className="flex items-center space-x-3 text-[9px] sm:text-[10px] font-medium tracking-[0.3em] text-neutral-700 uppercase cursor-pointer group hover:text-black transition-colors"
            >
              <span className="hidden sm:inline">SCROLL TO EXPLORE</span>
              <span className="sm:hidden">SCROLL</span>
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
