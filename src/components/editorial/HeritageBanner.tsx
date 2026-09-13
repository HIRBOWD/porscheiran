"use client";

import React from "react";
import Image from "next/image";

export default function HeritageBanner() {
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
          <p
            lang="fa"
            dir="rtl"
            className="text-xs text-neutral-500 dark:text-neutral-400 font-light max-w-md leading-relaxed font-sans text-right"
            style={{ letterSpacing: "normal" }}
          >
            باشگاه رانندگان پورشه، فضایی اختصاصی برای مالکان خودروهای پورشه است؛ جایی برای ارتباط با دیگر مالکان و شرکت در رویدادهای اختصاصی و تجربه برنامه‌های ویژه باشگاه.
          </p>
        </div>

        {/* Split Curated Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Card 1: دورهمی باشگاه پورشه ایران */}
          <div className="group relative bg-white dark:bg-[#121216] border border-black/[0.06] dark:border-white/[0.08] overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-[16/10] w-full bg-[#EAEAEF] dark:bg-[#18181D] overflow-hidden">
              <Image
                src="/images/products/club1.jpg"
                alt="دورهمی باشگاه پورشه ایران"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-6 left-6">
                <span
                  lang="fa"
                  className="text-[10px] px-3 py-1 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-sans font-medium"
                  style={{ letterSpacing: "normal" }}
                >
                  دورهمی باشگاه
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-center justify-between bg-white dark:bg-[#121216]">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                ARCHIVED IMAGES
              </span>
            </div>
          </div>

          {/* Card 2: Porsche Iran */}
          <div className="group relative bg-white dark:bg-[#121216] border border-black/[0.06] dark:border-white/[0.08] overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-[16/10] w-full bg-[#EAEAEF] dark:bg-[#18181D] overflow-hidden">
              <Image
                src="/images/products/club2.jpg"
                alt="پورشه ایران"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-6 left-6">
                <span className="text-[9px] tracking-[0.25em] uppercase px-3 py-1 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono font-medium">
                  PORSCHE IRAN
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex items-center justify-between bg-white dark:bg-[#121216]">
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                ARCHIVED IMAGES
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
