"use client";

import React, { useState } from "react";
import { soundManager } from "@/lib/audio";
import { Move3D, Lock, RotateCw, Maximize2 } from "lucide-react";

interface SketchfabPorsche911Props {
  scrollProgress: number; // 0 to 1
  isVisible: boolean;
}

export default function SketchfabPorsche911({
  scrollProgress,
  isVisible,
}: SketchfabPorsche911Props) {
  const [isInteractive, setIsInteractive] = useState(false);

  // Calculate smooth emergence, center resting, and exit transforms
  let opacity = 0;
  let scale = 0.88;
  let translateY = 30;

  if (scrollProgress >= 0.54 && scrollProgress < 0.7) {
    // Emerging from exact center point
    const emergeP = (scrollProgress - 0.54) / 0.16; // 0 to 1
    opacity = Math.min(1, emergeP * 1.25);
    scale = 0.86 + emergeP * 0.14;
    translateY = 30 * (1 - emergeP);
  } else if (scrollProgress >= 0.7 && scrollProgress <= 0.88) {
    // Full center focus inside circular halo
    opacity = 1;
    scale = 1.0;
    translateY = 0;
  } else if (scrollProgress > 0.88) {
    // Gliding gently upward into accessories boutique
    const outP = (scrollProgress - 0.88) / 0.12;
    opacity = Math.max(0, 1 - outP * 1.2);
    scale = 1.0 - outP * 0.08;
    translateY = -outP * 60;
  }

  if (!isVisible && opacity <= 0) return null;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1100px] h-[480px] sm:h-[540px] md:h-[620px] px-2 sm:px-4 z-15 flex flex-col items-center justify-center transition-all duration-300 pointer-events-none"
      style={{
        opacity: Math.max(0, Math.min(1, opacity)),
        transform: `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale})`,
        willChange: "transform, opacity",
      }}
    >
      {/* Sketchfab 3D Embed Wrapper */}
      <div className="sketchfab-embed-wrapper relative w-full h-full rounded-2xl overflow-hidden">
        <iframe
          title="(FREE) Porsche 911 Carrera 4S"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          src="https://sketchfab.com/models/d01b254483794de3819786d93e0e1ebf/embed?autostart=1&transparent=1&ui_infos=0&ui_watermark_link=0&ui_watermark=0&scrollwheel=0"
          className={`w-full h-full block border-0 transition-opacity duration-700 ${
            isInteractive ? "pointer-events-auto cursor-grab active:cursor-grabbing" : "pointer-events-none"
          }`}
        />

        {/* Soft Floor Shadow Overlay */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-8 rounded-full blur-[22px] pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 80%)",
          }}
        />

        {/* Interactive Mode Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setIsInteractive(!isInteractive);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase transition-all duration-300 shadow-sm border ${
              isInteractive
                ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                : "bg-white/90 hover:bg-white text-neutral-800 border-black/[0.08] hover:border-black/20"
            }`}
          >
            {isInteractive ? (
              <>
                <Lock className="w-3 h-3 text-[#D5001C]" />
                <span>LOCK TO SCROLL</span>
              </>
            ) : (
              <>
                <Move3D className="w-3 h-3 text-neutral-600" />
                <span>INTERACT WITH 3D 911</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
