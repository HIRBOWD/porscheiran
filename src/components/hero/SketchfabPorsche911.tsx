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

  if (!isVisible && opacity <= 0.001) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
      style={{
        opacity: Math.max(0, Math.min(1, opacity)),
        visibility: opacity <= 0.001 ? "hidden" : "visible",
        transition: "opacity 0.25s ease-out",
        willChange: "opacity",
      }}
    >
      {/* Centered Vehicle Container inside circular halo */}
      <div
        className="relative w-full max-w-[1000px] h-[460px] sm:h-[520px] md:h-[600px] px-2 sm:px-6 flex flex-col items-center justify-center"
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          willChange: "transform",
        }}
      >
        {/* Sketchfab 3D Embed Wrapper */}
        <div className="sketchfab-embed-wrapper relative w-full h-full rounded-2xl overflow-hidden">
          <iframe
            title="(FREE) Porsche 911 Carrera 4S"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; xr-spatial-tracking"
            src="https://sketchfab.com/models/d01b254483794de3819786d93e0e1ebf/embed?preload=1&transparent=1&autostart=1&ui_infos=0&ui_watermark_link=0&ui_watermark=0&scrollwheel=0"
            className={`w-full h-full block border-0 transition-opacity duration-700 ${
              isInteractive ? "pointer-events-auto cursor-grab active:cursor-grabbing" : "pointer-events-none"
            }`}
          />

          {/* Soft Floor Shadow Overlay */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none -z-10">
            <div
              className="w-[70%] h-8 rounded-full blur-[22px]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 80%)",
              }}
            />
          </div>

          {/* Interactive Mode Controls */}
          <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none">
            <button
              onClick={() => {
                soundManager.playClick();
                setIsInteractive(!isInteractive);
              }}
              className={`pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase transition-all duration-300 shadow-sm border ${
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
    </div>
  );
}
