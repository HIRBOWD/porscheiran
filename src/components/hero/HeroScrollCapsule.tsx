"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { soundManager } from "@/lib/audio";

interface HeroScrollCapsuleProps {
  scrollProgressRef: React.RefObject<number>;
  onNavigateSection?: (progress: number) => void;
}

interface SectionMilestone {
  index: string;
  title: string;
  progress: number;
  yPercent: number; // 0 to 1 along capsule height
}

const SECTIONS: SectionMilestone[] = [
  { index: "01", title: "INTRO", progress: 0.0, yPercent: 0.06 },
  { index: "02", title: "DESIGN", progress: 0.35, yPercent: 0.35 },
  { index: "03", title: "PERFORMANCE", progress: 0.68, yPercent: 0.65 },
  { index: "04", title: "ACCESSORIES", progress: 0.98, yPercent: 0.94 },
];

export default function HeroScrollCapsule({
  scrollProgressRef,
  onNavigateSection,
}: HeroScrollCapsuleProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const carIndicatorRef = useRef<HTMLDivElement>(null);
  const activeSectionRef = useRef<number>(0);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    let lastActive = 0;

    const updateCapsulePosition = () => {
      const track = trackRef.current;
      const car = carIndicatorRef.current;
      if (!track || !car) return;

      const p = Math.max(0, Math.min(1, scrollProgressRef.current ?? 0));

      // Calculate vertical travel bounds inside the pill
      const trackHeight = track.clientHeight;
      const carHeight = car.clientHeight;
      const verticalPadding = 8; // Top/bottom padding
      const maxTravel = Math.max(0, trackHeight - carHeight - verticalPadding * 2);

      // Direct GPU-accelerated transform: 120 FPS, 0 React re-renders on scroll
      const travelY = verticalPadding + p * maxTravel;
      car.style.transform = `translate3d(-50%, ${travelY}px, 0)`;

      // Determine active section milestone
      let currentSection = 0;
      if (p >= 0.82) {
        currentSection = 3; // ACCESSORIES
      } else if (p >= 0.52) {
        currentSection = 2; // PERFORMANCE
      } else if (p >= 0.22) {
        currentSection = 1; // DESIGN
      } else {
        currentSection = 0; // INTRO
      }

      if (currentSection !== lastActive) {
        lastActive = currentSection;
        activeSectionRef.current = currentSection;
        setActiveSection(currentSection);
      }
    };

    // Attach to the shared GSAP master ticker for 1:1 instantaneous lockstep with 3D GT3
    gsap.ticker.add(updateCapsulePosition);

    return () => {
      gsap.ticker.remove(updateCapsulePosition);
    };
  }, [scrollProgressRef]);

  const handleSectionClick = (targetProgress: number) => {
    soundManager.playClick();
    onNavigateSection?.(targetProgress);
  };

  return (
    <div className="fixed right-3 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 pointer-events-auto flex items-center select-none">
      {/* SECTION MARKERS (Desktop / Tablet) */}
      <div className="hidden md:flex flex-col justify-between h-[320px] py-1 mr-3 text-right">
        {SECTIONS.map((sec, idx) => {
          const isActive = activeSection === idx;
          return (
            <button
              key={sec.index}
              onClick={() => handleSectionClick(sec.progress)}
              className="group flex items-center justify-end gap-2.5 cursor-pointer transition-all duration-300 py-1"
              aria-label={`Navigate to ${sec.index} ${sec.title}`}
            >
              {/* Marker Label */}
              <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.25em] uppercase">
                <span
                  className={`transition-colors duration-300 ${
                    isActive
                      ? "text-neutral-900 dark:text-white font-bold"
                      : "text-neutral-400/80 dark:text-neutral-500/80 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
                  }`}
                >
                  {sec.index}
                </span>
                <span
                  className={`transition-colors duration-300 ${
                    isActive
                      ? "text-neutral-900 dark:text-white font-semibold"
                      : "text-neutral-400/60 dark:text-neutral-500/60 group-hover:text-neutral-600 dark:group-hover:text-neutral-400"
                  }`}
                >
                  — {sec.title}
                </span>
              </div>

              {/* 1px Thin Connecting Hairline */}
              <div
                className={`h-[1px] transition-all duration-300 ${
                  isActive
                    ? "w-5 bg-neutral-900 dark:bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                    : "w-2.5 bg-neutral-300/80 dark:bg-white/20 group-hover:w-4 group-hover:bg-neutral-500 dark:group-hover:bg-white/50"
                }`}
              />
            </button>
          );
        })}
      </div>

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
        {SECTIONS.map((sec) => (
          <div
            key={`tick-${sec.index}`}
            className="absolute left-1/2 -translate-x-1/2 w-2 h-[1px] bg-neutral-400/40 dark:bg-white/[0.20]"
            style={{ top: `${sec.yPercent * 100}%` }}
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
