"use client";

import React from "react";
import { soundManager } from "@/lib/audio";
import { X, ArrowRight, Volume2, VolumeX, ShieldCheck, MapPin } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModel?: (index: number) => void;
}

export default function MobileMenu({ isOpen, onClose, onSelectModel }: MobileMenuProps) {
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
        className="absolute inset-0 bg-neutral-950/50 backdrop-blur-md"
        onClick={() => {
          soundManager.playClick();
          onClose();
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-[#F6F6F8] shadow-2xl border-l border-black/[0.08] flex flex-col justify-between p-8 md:p-12 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-8 border-b border-black/[0.06]">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-neutral-400 font-mono">
              PORSCHE NAVIGATION
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 text-neutral-600 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="py-10 space-y-8">
            <div>
              <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-3">
                VEHICLE SHOWROOM
              </span>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onSelectModel?.(0);
                    onClose();
                    soundManager.playEngineRev("gt3");
                  }}
                  className="w-full text-left text-lg md:text-xl font-light tracking-[0.15em] text-neutral-900 hover:text-black uppercase flex items-center justify-between group cursor-pointer"
                >
                  <span>01 / 911 GT3 RS</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-black/[0.06]">
              <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase block mb-3">
                BOUTIQUE & DISCOVERY
              </span>
              <div className="space-y-4 text-sm font-medium tracking-[0.2em] uppercase text-neutral-800">
                <button
                  onClick={() => handleNav("boutique-store")}
                  className="block hover:text-black hover:translate-x-1 transition-transform cursor-pointer"
                >
                  ALL ACCESSORIES & TEQUIPMENT
                </button>
                <button
                  onClick={() => handleNav("heritage-collections")}
                  className="block hover:text-black hover:translate-x-1 transition-transform cursor-pointer"
                >
                  HERITAGE 1963 CURATION
                </button>
                <button
                  onClick={() => handleNav("craftsmanship-manifesto")}
                  className="block hover:text-black hover:translate-x-1 transition-transform cursor-pointer"
                >
                  DESIGN PHILOSOPHY
                </button>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-8 border-t border-black/[0.06] space-y-4">
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
