"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { VehicleModel } from "@/data/vehicles";

interface VehicleStageProps {
  vehicle: VehicleModel;
  opacity: number;
  scale: number;
  translateY: number;
  translateX?: number;
  blur?: number;
  enable3dFallback?: boolean;
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

  return (
    <div
      ref={containerRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1100px] px-4 pointer-events-none select-none z-10 flex flex-col items-center justify-center transition-opacity duration-300"
      style={{
        opacity: Math.max(0, Math.min(1, opacity)),
        transform: `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale})`,
        filter: blur > 0 ? `blur(${blur}px)` : "none",
        willChange: "transform, opacity, filter",
      }}
    >
      {/* Dynamic contact shadow & studio floor reflection */}
      <div className="relative w-full aspect-[16/9] max-h-[560px] flex items-center justify-center">
        {/* Floor Contact Shadow */}
        <div
          className="absolute bottom-[10%] left-[10%] right-[10%] h-[36px] rounded-full blur-[20px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0) 70%)",
            opacity: Math.max(0.2, opacity * 0.9),
          }}
        />

        {/* High-Resolution Studio Photography Layer */}
        <div className="relative w-full h-full">
          <Image
            src={vehicle.image}
            alt={`Porsche ${vehicle.name}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
            className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.06)]"
          />
        </div>

        {/* Studio Floor Soft Reflection Overlay */}
        <div
          className="absolute -bottom-[28%] left-0 right-0 h-[30%] overflow-hidden pointer-events-none opacity-20 scale-y-[-1] blur-[3px]"
          style={{
            maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)",
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src={vehicle.image}
              alt=""
              fill
              aria-hidden="true"
              sizes="1100px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
