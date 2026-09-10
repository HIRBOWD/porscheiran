"use client";

import React from "react";

interface HaloRingProps {
  scale?: number;
  glowColor?: string;
  isExpanding?: boolean;
}

export default function HaloRing({
  scale = 1,
  glowColor = "rgba(220, 225, 235, 0.4)",
  isExpanding = false,
}: HaloRingProps) {
  return (
    <div
      className="absolute top-1/2 left-1/2 pointer-events-none transition-transform duration-700 ease-out z-0 flex items-center justify-center"
      style={{
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: "min(80vw, 680px)",
        height: "min(80vw, 680px)",
        willChange: "transform",
      }}
    >
      {/* Outer ambient studio diffused glow */}
      <div
        className="absolute inset-[-12%] rounded-full blur-[65px] pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, rgba(255,255,255,0) 70%)`,
          opacity: isExpanding ? 0.85 : 0.45,
        }}
      />

      {/* SVG Geometric Precision Halo */}
      <svg
        viewBox="0 0 700 700"
        className="w-full h-full animate-halo-spin"
        style={{ animationDuration: "140s" }}
      >
        <defs>
          <linearGradient id="haloSheen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#D4D4D8" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#71717A" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.7" />
          </linearGradient>

          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="85%" stopColor="#F4F4F6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#E4E4E7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft interior studio fill */}
        <circle cx="350" cy="350" r="325" fill="url(#centerGlow)" />

        {/* Main 1.2px Primary Ring */}
        <circle
          cx="350"
          cy="350"
          r="320"
          fill="none"
          stroke="url(#haloSheen)"
          strokeWidth="1.2"
          className="transition-all duration-500"
        />

        {/* Outer Hairline Ring */}
        <circle
          cx="350"
          cy="350"
          r="336"
          fill="none"
          stroke="rgba(0,0,0,0.04)"
          strokeWidth="0.75"
        />

        {/* Inner Hairline Ring */}
        <circle
          cx="350"
          cy="350"
          r="305"
          fill="none"
          stroke="rgba(0,0,0,0.03)"
          strokeWidth="0.5"
          strokeDasharray="4 8"
        />

        {/* Precision Architectural Studio Markers */}
        <g stroke="rgba(0,0,0,0.18)" strokeWidth="1">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 350 + Math.cos(angle) * 314;
            const y1 = 350 + Math.sin(angle) * 314;
            const x2 = 350 + Math.cos(angle) * 326;
            const y2 = 350 + Math.sin(angle) * 326;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>

        {/* Subtle Porsche Accent Dot */}
        <circle cx="350" cy="30" r="2.5" fill="#D5001C" opacity="0.85" />
      </svg>
    </div>
  );
}
