"use client";

import React from "react";
import { soundManager } from "@/lib/audio";
import { useTheme } from "@/context/ThemeContext";
import { X, ArrowRight, Sun, Moon, ShieldCheck, MapPin } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel?: (index: number) => void;
}

export default function MobileMenu({ isOpen, onClose, onSelectModel }: MobileMenuProps) {
  const { isDark, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const handleNav = (targetId: string) => {
    soundManager.playClick();
    onClose();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-md"
        onClick={() => {
          soundManager.playClick();
          onClose();
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-[#F6F6F8] dark:bg-[#0B0B0D] shadow-2xl border-l border-black/[0.08] dark:border-white/[0.08] flex flex-col justify-between p-8 md:p-12 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-8 border-b border-black/[0.06] dark:border-white/[0.06]">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neutral-400 font-mono">
              PORSCHE NAVIGATION
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="py-10 space-y-8">
            <div>
              <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-3">
                VEHICLE SHOWROOM & CATALOG
              </span>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onSelectModel?.(0);
                    onClose();
                  }}
                  className="w-full text-left text-lg font-light tracking-[0.15em] text-neutral-900 dark:text-white hover:text-black dark:hover:text-neutral-300 uppercase flex items-center justify-between group cursor-pointer"
                >
                  <span>01 / 911 GT3 RS</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              {/* Models List */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
                {["Macan", "Cayman", "Cayenne", "Boxster", "911", "Panamera"].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleNav("boutique-store")}
                    className="text-left py-1.5 px-2.5 bg-neutral-200/50 dark:bg-neutral-900/50 text-[11px] font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-3">
                BOUTIQUE & DISCOVERY
              </span>
              <div className="space-y-4 text-sm font-medium tracking-[0.2em] uppercase text-neutral-800 dark:text-neutral-200">
                <button
                  onClick={() => handleNav("boutique-store")}
                  className="block hover:text-black dark:hover:text-white hover:translate-x-1 transition-transform cursor-pointer text-left w-full"
                >
                  ALL ACCESSORIES & TEQUIPMENT
                </button>
                <button
                  onClick={() => handleNav("heritage-collections")}
                  className="block hover:text-black dark:hover:text-white hover:translate-x-1 transition-transform cursor-pointer text-left w-full"
                >
                  HERITAGE 1963 CURATION
                </button>
                <button
                  onClick={() => handleNav("craftsmanship-manifesto")}
                  className="block hover:text-black dark:hover:text-white hover:translate-x-1 transition-transform cursor-pointer text-left w-full"
                >
                  DESIGN PHILOSOPHY
                </button>
              </div>
            </div>

            {/* Theme Toggle in Mobile Menu */}
            <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                APPEARANCE
              </span>
              <button
                onClick={() => {
                  soundManager.playClick();
                  toggleTheme();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 text-[10px] font-mono tracking-widest uppercase text-neutral-800 dark:text-neutral-200 cursor-pointer"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-sans">روشن</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-neutral-700" />
                    <span className="font-sans">تیره</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-8 border-t border-black/[0.06] dark:border-white/[0.06] space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>STUTTGART-ZUFFENHAUSEN • GERMANY</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>OFFICIAL FACTORY TEQUIPMENT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
