"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { VehicleModel } from "@/data/vehicles";

interface VehicleStageProps {
  vehicle: VehicleModel;
  opacity: number;
  scale: number;
  translateY: number;
  translateX?: number;
  blur?: number;
}

export default function VehicleStage({
  vehicle,
  opacity,
  scale,
  translateY,
  translateX = 0,
  blur = 0,
}: VehicleStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clampedOpacity = Math.max(0, Math.min(1, opacity));

  return (
    <div
      ref={containerRef}
      className="absolute top-1/2 left-1/2 pointer-events-none select-none z-10 flex flex-col items-center justify-center transition-opacity duration-300 w-full max-w-[1060px] px-4 md:px-8"
      style={{
        opacity: clampedOpacity,
        visibility: clampedOpacity <= 0.01 ? "hidden" : "visible",
        transform: `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale})`,
        filter: blur > 0 ? `blur(${blur}px)` : "none",
        willChange: "transform, opacity, filter",
      }}
    >
      {/* Studio Vehicle Presentation */}
      <div className="relative w-full aspect-[16/9] max-h-[520px] flex items-center justify-center">
        {/* Soft Ambient Contact Shadow */}
        <div
          className="absolute bottom-[8%] left-[12%] right-[12%] h-[32px] rounded-full blur-[24px] pointer-events-none transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.14) 45%, rgba(0,0,0,0) 70%)",
            opacity: clampedOpacity * 0.95,
          }}
        />

        {/* High-Resolution Studio Photography */}
        <div className="relative w-full h-full">
          <Image
            src={vehicle.image}
            alt={`Porsche ${vehicle.name}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1060px"
            className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.06)]"
          />
        </div>
      </div>
    </div>
  );
}
