"use client";

import React, { useState } from "react";
import { soundManager } from "@/lib/audio";
import { Move3D, Lock } from "lucide-react";

interface SketchfabPorscheMacanProps {
  scrollProgress: number; // 0 to 1
  isVisible: boolean;
}

export default function SketchfabPorscheMacan({
  scrollProgress,
  isVisible,
}: SketchfabPorscheMacanProps) {
  const [isInteractive, setIsInteractive] = useState(false);

  // Calculate smooth scale, opacity, and exit transform
  let opacity = 1;
  let scale = 1.0;
  let translateY = 0;

  if (scrollProgress <= 0.16) {
    // At rest / Hero entry view
    opacity = 1;
    scale = 1.0 - scrollProgress * 0.3;
    translateY = -scrollProgress * 40;
  } else if (scrollProgress > 0.16 && scrollProgress <= 0.35) {
    // Dissolving smoothly into Boxster phase
    const exitP = (scrollProgress - 0.16) / 0.19; // 0 to 1
    opacity = Math.max(0, 1 - exitP * 1.25);
    scale = 0.95 - exitP * 0.22;
    translateY = -15 - exitP * 55;
  } else {
    opacity = 0;
    scale = 0.72;
    translateY = -70;
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
            title="Porsche GT3 RS"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; xr-spatial-tracking"
            src="https://sketchfab.com/models/e738eae819c34d19a31dd066c45e0f3d/embed?preload=1&transparent=1&autostart=1&ui_infos=0&ui_watermark_link=0&ui_watermark=0&scrollwheel=0"
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
                  <span>INTERACT WITH 3D MACAN</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
