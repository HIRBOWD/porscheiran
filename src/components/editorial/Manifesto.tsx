"use client";

import React from "react";

export default function Manifesto() {
  return (
    <section
      id="craftsmanship-manifesto"
      className="relative w-full bg-[#FFFFFF] py-28 md:py-40 px-8 md:px-16 border-t border-black/[0.06] overflow-hidden"
    >
      {/* Background Subtle Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-bold text-black/[0.015] tracking-[0.3em] uppercase select-none pointer-events-none whitespace-nowrap">
        WEISSACH
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-neutral-400 font-mono block mb-6">
          THE DESIGN PHILOSOPHY
        </span>

        <blockquote className="text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.08em] text-neutral-900 uppercase leading-snug">
          &ldquo;IN THE BEGINNING, I LOOKED AROUND AND COULD NOT FIND QUITE THE CAR I&apos;D BEEN DREAMING OF. SO I DECIDED TO BUILD IT MYSELF.&rdquo;
        </blockquote>

        <div className="mt-8 flex flex-col items-center">
          <div className="w-8 h-[1px] bg-neutral-300 mb-4" />
          <cite className="not-italic text-xs tracking-[0.25em] uppercase font-mono text-neutral-800 font-medium">
            FERRY PORSCHE
          </cite>
          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-neutral-400 mt-1">
            FOUNDER, DR. ING. H.C. F. PORSCHE AG
          </span>
        </div>

        {/* 3 Core Pillars */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left pt-12 border-t border-black/[0.05]">
          <div className="p-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 block mb-2">
              01 / PURITY
            </span>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-900 mb-2">
              REDUCTION TO THE ESSENTIAL
            </h4>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Every curve, stitch, and tolerance is engineered with purpose. No unnecessary decoration—only pure functional elegance.
            </p>
          </div>

          <div className="p-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 block mb-2">
              02 / WEISSACH GENES
            </span>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-900 mb-2">
              TESTED ON TRACK
            </h4>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Motorsport technologies directly inspire our accessories—from forged aluminum rims to titanium exhaust soundbars.
            </p>
          </div>

          <div className="p-4">
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 block mb-2">
              03 / HERITAGE
            </span>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-900 mb-2">
              TIMELESS LEGACY
            </h4>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              Handcrafted in Europe using genuine historical materials, preserved to accompany your vehicle for generations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
