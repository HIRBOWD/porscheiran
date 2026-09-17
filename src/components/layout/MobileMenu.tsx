"use client";

import React from "react";
import { soundManager } from "@/lib/audio";
import { useTheme } from "@/context/ThemeContext";
import { X, ArrowLeft, Sun, Moon, ShieldCheck, MapPin, Sparkles } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel?: (index: number) => void;
}

const VEHICLE_MODELS = [
  { name: "911", fa: "۹۱۱" },
  { name: "Macan", fa: "ماکان" },
  { name: "Cayenne", fa: "کاین" },
  { name: "Panamera", fa: "پانامرا" },
  { name: "Boxster", fa: "باکستر" },
  { name: "Cayman", fa: "کیمن" },
];

export default function MobileMenu({ isOpen, onClose, onSelectModel }: MobileMenuProps) {
  const { isDark, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const handleNav = (targetId: string) => {
    soundManager.playClick();
    onClose();
    if (targetId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/70 backdrop-blur-md transition-opacity"
        onClick={() => {
          soundManager.playClick();
          onClose();
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#F6F6F8] dark:bg-[#0B0B0D] shadow-2xl border-l border-black/[0.08] dark:border-white/[0.08] flex flex-col justify-between p-6 sm:p-8 md:p-10 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex items-center gap-3">
              <img
                src="/images/porsche-iran-crest.png"
                alt="Porsche Iran Crest"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow"
              />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-neutral-950 dark:text-white font-mono">
                  PORSCHE IRAN
                </span>
                <span
                  lang="fa"
                  className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans"
                  style={{ letterSpacing: "normal" }}
                >
                  منوی دسترسی و ناوبری
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              aria-label="بستن منو"
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="py-6 space-y-7">
            {/* Section 1: 3D Vehicle Showcase */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                  01 / SHOWROOM
                </span>
                <span
                  lang="fa"
                  className="text-[10px] text-neutral-400 font-sans"
                  style={{ letterSpacing: "normal" }}
                >
                  شو روم اختصاصی
                </span>
              </div>

              <button
                onClick={() => {
                  onSelectModel?.(0);
                  handleNav("top");
                }}
                className="w-full p-3.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-all text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-semibold tracking-[0.1em] text-neutral-950 dark:text-white uppercase font-mono group-hover:text-[#D5001C] transition-colors">
                    911 GT3 RS
                  </span>
                  <span
                    lang="fa"
                    className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-sans"
                    style={{ letterSpacing: "normal" }}
                  >
                    مشاهده تعاملی سه‌بعدی و مشخصات آیرودینامیک
                  </span>
                </div>
                <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:-translate-x-1 transition-all shrink-0" />
              </button>

              {/* Models Quick Grid */}
              <div className="mt-3 pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
                <span
                  lang="fa"
                  className="text-[10px] text-neutral-400 font-sans block mb-2"
                  style={{ letterSpacing: "normal" }}
                >
                  انتخاب مدل خودرو جهت مشاهده قطعات:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {VEHICLE_MODELS.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => handleNav("boutique-store")}
                      className="py-1.5 px-2 rounded bg-neutral-200/50 dark:bg-neutral-900/50 text-[10px] font-mono tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all text-center cursor-pointer"
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Main Website Sections */}
            <div className="pt-5 border-t border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-3">
                02 / NAVIGATION & DISCOVERY
              </span>

              <div className="space-y-2.5">
                {/* Store Section */}
                <button
                  onClick={() => handleNav("boutique-store")}
                  className="w-full p-3 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-all flex items-center justify-between group cursor-pointer text-left"
                >
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold tracking-[0.1em] text-neutral-900 dark:text-white uppercase">
                      اکسسوری‌ها و قطعات
                    </span>
                    <span
                      lang="fa"
                      className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans mt-0.5"
                      style={{ letterSpacing: "normal" }}
                    >
                      PORSCHE TEQUIPMENT • فیس‌لیفت، قطعات یدکی و مصرفی
                    </span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:-translate-x-1 transition-all shrink-0" />
                </button>

                {/* Club Section */}
                <button
                  onClick={() => handleNav("heritage-collections")}
                  className="w-full p-3 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-all flex items-center justify-between group cursor-pointer text-left"
                >
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold tracking-[0.1em] text-neutral-900 dark:text-white uppercase">
                      باشگاه پورشه ایران
                    </span>
                    <span
                      lang="fa"
                      className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans mt-0.5"
                      style={{ letterSpacing: "normal" }}
                    >
                      THE CLUB • گردهمایی‌ها و رویدادهای اختصاصی مالکان
                    </span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:-translate-x-1 transition-all shrink-0" />
                </button>

                {/* Manifesto */}
                <button
                  onClick={() => handleNav("craftsmanship-manifesto")}
                  className="w-full p-3 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-all flex items-center justify-between group cursor-pointer text-left"
                >
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold tracking-[0.1em] text-neutral-900 dark:text-white uppercase">
                      اصالت و مانیفست برند
                    </span>
                    <span
                      lang="fa"
                      className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans mt-0.5"
                      style={{ letterSpacing: "normal" }}
                    >
                      DRIVEN BY DREAMS • فلسفه بنیان‌گذار پورشه
                    </span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:-translate-x-1 transition-all shrink-0" />
                </button>

                {/* Services */}
                <button
                  onClick={() => handleNav("showroom-footer")}
                  className="w-full p-3 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-all flex items-center justify-between group cursor-pointer text-left"
                >
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold tracking-[0.1em] text-neutral-900 dark:text-white uppercase">
                      نحوه خدمات‌دهی و سفارش
                    </span>
                    <span
                      lang="fa"
                      className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans mt-0.5"
                      style={{ letterSpacing: "normal" }}
                    >
                      تأمین قطعات اورجینال از آلمان و امارات • عضویت در خبرنامه
                    </span>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:-translate-x-1 transition-all shrink-0" />
                </button>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="pt-5 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                  APPEARANCE / تم نمایش
                </span>
                <span
                  lang="fa"
                  className="text-[11px] text-neutral-600 dark:text-neutral-400 font-sans mt-0.5"
                  style={{ letterSpacing: "normal" }}
                >
                  {isDark ? "حالت تیره (Dark Studio)" : "حالت روشن (Light Studio)"}
                </span>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  toggleTheme();
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 text-[11px] font-mono tracking-wider uppercase text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span lang="fa" className="font-sans text-xs" style={{ letterSpacing: "normal" }}>روشن</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-neutral-700" />
                    <span lang="fa" className="font-sans text-xs" style={{ letterSpacing: "normal" }}>تیره</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2.5 text-[11px] text-neutral-500 font-sans" style={{ letterSpacing: "normal" }}>
              <ShieldCheck className="w-4 h-4 text-[#D5001C] shrink-0" />
              <span>تضمین اصالت ۱۰۰٪ قطعات Tequipment و بسته‌بندی پلمپ آلمان</span>
            </div>

            <div className="flex items-center gap-2.5 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>STUTTGART • DUBAI • TEHRAN DIRECT LINK</span>
            </div>

            <div className="pt-2 text-center border-t border-black/[0.04] dark:border-white/[0.04]">
              <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                DESIGN BY HIRBOD
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
