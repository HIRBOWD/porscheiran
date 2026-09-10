"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HaloRing from "./HaloRing";
import VehicleStage from "./VehicleStage";
import { VEHICLES } from "@/data/vehicles";
import { soundManager } from "@/lib/audio";
import { ChevronDown } from "lucide-react";

export default function CinematicScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Scene scroll progress (0 to 1)
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  // Calculated transforms for the 3 vehicles
  const [macanState, setMacanState] = useState({ opacity: 1, scale: 1, translateY: 0, blur: 0 });
  const [boxsterState, setBoxsterState] = useState({ opacity: 0, scale: 0.88, translateY: 40, blur: 6 });
  const [nineElevenState, setNineElevenState] = useState({ opacity: 0, scale: 0.88, translateY: 40, blur: 6 });
  const [haloScale, setHaloScale] = useState(1);
  const [haloGlow, setHaloGlow] = useState("rgba(220, 225, 235, 0.4)");
  const [bgAtmosphere, setBgAtmosphere] = useState(VEHICLES[0].studioAtmosphere.bgGradient);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: "+=3200", // Smooth long scroll runway
      pin: containerRef.current,
      anticipatePin: 1,
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;
        setScrollProgress(p);

        // ----------------------------------------------------
        // Continuous Cinematic Scroll Interpolation
        // ----------------------------------------------------

        // 1. MACAN (0.00 -> 0.33)
        if (p <= 0.16) {
          // Macan at rest / hero view
          setMacanState({
            opacity: 1,
            scale: 1.0 - p * 0.4,
            translateY: -p * 60,
            blur: 0,
          });
          setHaloScale(1.0 + p * 0.8);
          setHaloGlow("rgba(220, 225, 235, 0.4)");
          setBgAtmosphere(VEHICLES[0].studioAtmosphere.bgGradient);
          setActiveSceneIndex(0);
        } else if (p > 0.16 && p <= 0.34) {
          // Macan dissolving & morphing into Boxster
          const subP = (p - 0.16) / 0.18; // 0 to 1
          setMacanState({
            opacity: Math.max(0, 1 - subP * 1.3),
            scale: 0.94 - subP * 0.12,
            translateY: -10 - subP * 60,
            blur: subP * 6,
          });
          setHaloScale(1.12 + Math.sin(subP * Math.PI) * 0.2);
          setHaloGlow("rgba(210, 215, 230, 0.5)");
          setActiveSceneIndex(subP > 0.5 ? 1 : 0);
        } else {
          setMacanState({ opacity: 0, scale: 0.8, translateY: -80, blur: 8 });
        }

        // 2. BOXSTER (0.22 -> 0.68)
        if (p >= 0.20 && p < 0.36) {
          // Boxster emerging seamlessly from the exact same center point
          const emergeP = (p - 0.20) / 0.16; // 0 to 1
          setBoxsterState({
            opacity: Math.min(1, emergeP * 1.2),
            scale: 0.86 + emergeP * 0.14,
            translateY: 30 * (1 - emergeP),
            blur: (1 - emergeP) * 5,
          });
        } else if (p >= 0.36 && p <= 0.52) {
          // Boxster at full center glory
          setBoxsterState({
            opacity: 1,
            scale: 1.0,
            translateY: 0,
            blur: 0,
          });
          setHaloScale(1.18);
          setHaloGlow(VEHICLES[1].halo.glow);
          setBgAtmosphere(VEHICLES[1].studioAtmosphere.bgGradient);
          setActiveSceneIndex(1);
        } else if (p > 0.52 && p <= 0.68) {
          // Boxster dissolving into 911
          const exitP = (p - 0.52) / 0.16;
          setBoxsterState({
            opacity: Math.max(0, 1 - exitP * 1.3),
            scale: 1.0 - exitP * 0.12,
            translateY: -exitP * 60,
            blur: exitP * 6,
          });
          setHaloScale(1.18 + Math.sin(exitP * Math.PI) * 0.2);
          setActiveSceneIndex(exitP > 0.5 ? 2 : 1);
        } else {
          setBoxsterState({ opacity: 0, scale: 0.86, translateY: 40, blur: 6 });
        }

        // 3. 911 (0.56 -> 1.00)
        if (p >= 0.54 && p < 0.70) {
          // 911 emerging seamlessly
          const emergeP = (p - 0.54) / 0.16;
          setNineElevenState({
            opacity: Math.min(1, emergeP * 1.2),
            scale: 0.88 + emergeP * 0.12,
            translateY: 30 * (1 - emergeP),
            blur: (1 - emergeP) * 5,
          });
        } else if (p >= 0.70 && p <= 0.88) {
          // 911 at full focus
          setNineElevenState({
            opacity: 1,
            scale: 1.0,
            translateY: 0,
            blur: 0,
          });
          setHaloScale(1.24);
          setHaloGlow(VEHICLES[2].halo.glow);
          setBgAtmosphere(VEHICLES[2].studioAtmosphere.bgGradient);
          setActiveSceneIndex(2);
        } else if (p > 0.88) {
          // Transitioning gently upwards towards accessories boutique
          const outP = (p - 0.88) / 0.12;
          setNineElevenState({
            opacity: Math.max(0.1, 1 - outP * 0.5),
            scale: 1.0 - outP * 0.08,
            translateY: -outP * 70,
            blur: 0,
          });
          setHaloScale(1.24 + outP * 0.3);
          setActiveSceneIndex(2);
        } else {
          setNineElevenState({ opacity: 0, scale: 0.88, translateY: 40, blur: 6 });
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const scrollToSection = (targetProgress: number) => {
    soundManager.playClick();
    if (!triggerRef.current) return;
    const triggerTop = triggerRef.current.offsetTop;
    const totalDistance = 3200;
    const targetScroll = triggerTop + totalDistance * targetProgress;
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
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between transition-colors duration-1000 select-none"
        style={{ background: bgAtmosphere }}
      >
        {/* Soft Studio Overhead Light Diffusion */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-0" />

        {/* ------------------------------------------------------------------ */}
        {/* EXACT CENTER: Circular Halo & Centered Vehicles */}
        {/* ------------------------------------------------------------------ */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Circular Halo Ring */}
          <HaloRing
            scale={haloScale}
            glowColor={haloGlow}
            isExpanding={scrollProgress > 0.15 && scrollProgress < 0.9}
          />

          {/* Vehicle 01: MACAN */}
          <VehicleStage
            vehicle={VEHICLES[0]}
            opacity={macanState.opacity}
            scale={macanState.scale}
            translateY={macanState.translateY}
            blur={macanState.blur}
          />

          {/* Vehicle 02: BOXSTER */}
          <VehicleStage
            vehicle={VEHICLES[1]}
            opacity={boxsterState.opacity}
            scale={boxsterState.scale}
            translateY={boxsterState.translateY}
            blur={boxsterState.blur}
          />

          {/* Vehicle 03: 911 */}
          <VehicleStage
            vehicle={VEHICLES[2]}
            opacity={nineElevenState.opacity}
            scale={nineElevenState.scale}
            translateY={nineElevenState.translateY}
            blur={nineElevenState.blur}
          />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* HERO TYPOGRAPHY: Left Side (Exact match to prompt) */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative z-20 pt-32 md:pt-40 px-8 md:px-16 pointer-events-none max-w-xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.14em] text-neutral-900 uppercase leading-[1.08]">
            DRIVEN
            <br />
            <span className="font-semibold tracking-[0.16em]">BY MORE</span>
          </h1>

          <p className="mt-4 md:mt-6 text-[10px] md:text-[11px] font-medium tracking-[0.3em] text-neutral-500 uppercase leading-relaxed max-w-xs">
            ACCESSORIES FOR
            <br />
            A HIGHER STANDARD.
          </p>

          {/* Subtle Dynamic Model Specifications */}
          <div className="mt-8 md:mt-10 flex items-center space-x-6 text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-mono transition-opacity duration-500">
            <div>
              <span className="text-neutral-900 font-medium">{currentVehicle.specs.power}</span>
              <span className="block text-[8px] text-neutral-400">OUTPUT</span>
            </div>
            <div className="w-[1px] h-5 bg-neutral-200" />
            <div>
              <span className="text-neutral-900 font-medium">{currentVehicle.specs.acceleration}</span>
              <span className="block text-[8px] text-neutral-400">0–60 MPH</span>
            </div>
            <div className="w-[1px] h-5 bg-neutral-200" />
            <div>
              <span className="text-neutral-900 font-medium">{currentVehicle.specs.topSpeed}</span>
              <span className="block text-[8px] text-neutral-400">TOP SPEED</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* BOTTOM CONTROLS: Left Index, Right Scroll Indicator (Exact match) */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative z-20 pb-8 md:pb-12 px-8 md:px-16 flex items-end justify-between pointer-events-auto">
          {/* Bottom Left: Dynamic Scene Counter (01 / 02 / 03) */}
          <div className="flex items-baseline space-x-4">
            <span className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 font-mono">
              {currentVehicle.index}
            </span>
            <div className="flex flex-col text-[9px] tracking-[0.25em] text-neutral-400 uppercase font-mono">
              <span className="text-neutral-800 font-semibold">{currentVehicle.name}</span>
              <span>SCENE {currentVehicle.index} OF 03</span>
            </div>
          </div>

          {/* Interactive Scene Direct Jump Pills */}
          <div className="hidden sm:flex items-center space-x-3 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/[0.06] shadow-sm">
            {VEHICLES.map((v, i) => (
              <button
                key={v.id}
                onClick={() => scrollToSection(i === 0 ? 0 : i === 1 ? 0.44 : 0.78)}
                className={`text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  activeSceneIndex === i
                    ? "bg-neutral-900 text-white font-medium"
                    : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                }`}
              >
                {v.modelCode}
              </button>
            ))}
          </div>

          {/* Bottom Right: SCROLL with subtle animated downward indicator */}
          <button
            onClick={() => {
              soundManager.playClick();
              const storeEl = document.getElementById("boutique-store");
              if (storeEl) {
                storeEl.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="flex items-center space-x-3 text-[10px] font-medium tracking-[0.3em] text-neutral-700 uppercase cursor-pointer group hover:text-black transition-colors"
          >
            <span>SCROLL</span>
            <div className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center group-hover:border-black transition-colors">
              <ChevronDown className="w-3 h-3 text-neutral-700 group-hover:text-black animate-subtle-pulse" />
            </div>
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* IMPORTANT DESIGN DETAIL: 1px Light-Gray Architectural Separator */}
        {/* ------------------------------------------------------------------ */}
        <div className="arch-separator z-30" />
      </div>
    </section>
  );
}
