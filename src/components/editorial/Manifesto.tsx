"use client";

import React from "react";

export default function Manifesto() {
  return (
    <section
      id="craftsmanship-manifesto"
      className="relative w-full bg-[#FFFFFF] dark:bg-[#0E0E12] py-28 md:py-40 px-8 md:px-16 border-t border-black/[0.06] dark:border-white/[0.08] overflow-hidden"
    >
      {/* Background Subtle Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14vw] font-bold text-black/[0.015] dark:text-white/[0.02] tracking-[0.3em] uppercase select-none pointer-events-none whitespace-nowrap">
        WEISSACH
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-neutral-400 dark:text-neutral-500 font-mono block mb-6">
          DRIVEN BY DREAMS
        </span>

        <blockquote
          lang="fa"
          dir="rtl"
          className="text-2xl sm:text-3xl md:text-4xl font-light text-neutral-900 dark:text-white leading-relaxed font-sans max-w-3xl mx-auto"
          style={{ letterSpacing: "normal" }}
        >
          «وقتی چیزی که به دنبالش هستید وجود ندارد، باید خودتان آن را بسازید. این نگاه، آغاز مسیری بود که نام پورشه را شکل داد»
        </blockquote>

        <div className="mt-8 flex flex-col items-center">
          <div className="w-8 h-[1px] bg-neutral-300 dark:bg-neutral-700 mb-4" />
          <cite className="not-italic text-xs tracking-[0.25em] uppercase font-mono text-neutral-800 dark:text-neutral-200 font-medium">
            FERRY PORSCHE
          </cite>
          <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-neutral-400 dark:text-neutral-500 mt-1">
            FOUNDER PORSCHE AG
          </span>
        </div>

        {/* 3 Core Pillars */}
        <div
          dir="rtl"
          className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-right pt-12 border-t border-black/[0.05] dark:border-white/[0.06]"
        >
          <div className="p-4">
            <span
              lang="fa"
              className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 block mb-2 font-sans"
              style={{ letterSpacing: "normal" }}
            >
              01 / شفافیت در خدمات
            </span>
            <h4
              lang="fa"
              className="text-xs font-semibold text-neutral-900 dark:text-white mb-2 font-sans"
              style={{ letterSpacing: "normal" }}
            >
              ارائه بهترین سرویس ها
            </h4>
            <p
              lang="fa"
              className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed font-sans"
              style={{ letterSpacing: "normal" }}
            >
              ما میتوانیم ثبت سفارش قطعه ی مورد نظر شما مشتری محترم را با قرارداد کتبی و با ضمانت اصالت کالا برای شما در نمایندگی کشور های فوق انجام دهیم و در ایران / تهران تحویل دهیم
            </p>
          </div>

          <div className="p-4">
            <span
              lang="fa"
              className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 block mb-2 font-sans"
              style={{ letterSpacing: "normal" }}
            >
              02 / تجربه و دقت
            </span>
            <h4
              lang="fa"
              className="text-xs font-semibold text-neutral-900 dark:text-white mb-2 font-sans"
              style={{ letterSpacing: "normal" }}
            >
              بیش از ۸ سال سابقه تخصصی
            </h4>
            <p
              lang="fa"
              className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed font-sans"
              style={{ letterSpacing: "normal" }}
            >
              در پورشه ایران با به کار گیری بهترین مکانیک ها و متخصصین پورشه به همراه تجربه بالا ما میتوانید روی خدمات و تعمیرات برای خودرو پورشه خود روی ما حساب کنید
            </p>
          </div>

          <div className="p-4">
            <span
              lang="fa"
              className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 block mb-2 font-sans"
              style={{ letterSpacing: "normal" }}
            >
              03 / باشگاه پورشه ایران
            </span>
            <h4
              lang="fa"
              className="text-xs font-semibold text-neutral-900 dark:text-white mb-2 font-sans"
              style={{ letterSpacing: "normal" }}
            >
              دورهمی های اختصاصی
            </h4>
            <p
              lang="fa"
              className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed font-sans"
              style={{ letterSpacing: "normal" }}
            >
              دوستانی که دارنده هر مدلی از پورشه در تهران هستند میتوانند با ثبت نام در باشگاه ما میتوانند در دورهمی های خودرویی کلاب ما با رعایت قوانین و ضوابط راهنمایی و رانندگی و استاندارد های جهانی پورشه کلاب شرکت کنند
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
