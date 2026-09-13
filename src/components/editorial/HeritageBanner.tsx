"use client";

import React from "react";
import Image from "next/image";
import { soundManager } from "@/lib/audio";
import { ArrowUpRight } from "lucide-react";

export default function HeritageBanner() {
  const scrollToStore = () => {
    soundManager.playClick();
    const el = document.getElementById("boutique-store");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="heritage-collections" className="relative w-full bg-[#F6F6F8] dark:bg-[#0B0B0D] py-24 px-6 md:px-12 border-t border-black/[0.06] dark:border-white/[0.08]">
      <div className="max-w-[1720px] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 pb-6 border-b border-black/[0.06] dark:border-white/[0.08] gap-4">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-500 font-mono block mb-2">
              03 / THE CLUB
            </span>
            <h2
              lang="fa"
              className="text-3xl md:text-4xl font-normal text-neutral-950 dark:text-white font-sans"
              style={{ letterSpacing: "normal" }}
            >
              باشگاه پورشه ایران
            </h2>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light max-w-md leading-relaxed font-mono">
            Timeless aesthetics rooted in racing victories and Stuttgart craftsmanship since 1948.
          </p>
        </div>

        {/* Split Curated Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Card 1: Heritage 1963 Collection */}
          <div className="group relative bg-white dark:bg-[#121216] border border-black/[0.06] dark:border-white/[0.08] overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-[16/10] w-full bg-[#EAEAEF] dark:bg-[#18181D] overflow-hidden">
              <Image
                src="/images/products/weekender.jpg"
                alt="Heritage 1963 Collection"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-6 left-6">
                <span className="text-[9px] tracking-[0.25em] uppercase px-3 py-1 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono font-medium">
                  EDITION 1963
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-light tracking-widest uppercase">
                  THE HERITAGE PEPITA LINE
                </h3>
                <p className="mt-1 text-xs text-white/80 font-light leading-relaxed">
                  Authentic houndstooth woven fabrics matching the earliest 911 interiors, finished with vegetable-tanned Bavarian leather.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 flex items-center justify-between bg-white dark:bg-[#121216]">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                TRAVEL, BAGS & ACCESSORIES
              </span>
              <button
                onClick={scrollToStore}
                className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-900 dark:text-white hover:text-black dark:hover:text-neutral-300 group-hover:translate-x-1 transition-all cursor-pointer"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: GT3 RS Carbon Line */}
          <div className="group relative bg-white dark:bg-[#121216] border border-black/[0.06] dark:border-white/[0.08] overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-[16/10] w-full bg-[#EAEAEF] dark:bg-[#18181D] overflow-hidden">
              <Image
                src="/images/products/soundbar.jpg"
                alt="GT3 RS Carbon Line"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-6 left-6">
                <span className="text-[9px] tracking-[0.25em] uppercase px-3 py-1 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono font-medium">
                  WEISSACH MOTORSPORT
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-light tracking-widest uppercase">
                  GT3 RS ACOUSTIC & PERFORMANCE
                </h3>
                <p className="mt-1 text-xs text-white/80 font-light leading-relaxed">
                  Genuine titanium and carbon parts re-engineered directly from race cars into acoustic audio systems and wall art.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 flex items-center justify-between bg-white dark:bg-[#121216]">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                SOUND, HARDWARE & TECH
              </span>
              <button
                onClick={scrollToStore}
                className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-900 dark:text-white hover:text-black dark:hover:text-neutral-300 group-hover:translate-x-1 transition-all cursor-pointer"
              >
                <span>EXPLORE LINE</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
