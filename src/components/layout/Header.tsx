"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { soundManager } from "@/lib/audio";
import { Search, ShoppingBag, Volume2, VolumeX } from "lucide-react";

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  onSelectModel?: (index: number) => void;
}

export default function Header({ onOpenSearch, onOpenMenu, onSelectModel }: HeaderProps) {
  const { itemCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showModelsDropdown, setShowModelsDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleAudio = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleNavClick = (targetId: string) => {
    soundManager.playClick();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#F6F6F8]/85 backdrop-blur-md border-b border-black/[0.06] py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
            : "bg-transparent py-6 md:py-7 border-b border-black/[0.03]"
        }`}
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
          {/* Left Navigation */}
          <nav className="hidden lg:flex items-center space-x-10 text-[11px] font-medium tracking-[0.25em] text-neutral-800">
            <div
              className="relative py-2 group"
              onMouseEnter={() => setShowModelsDropdown(true)}
              onMouseLeave={() => setShowModelsDropdown(false)}
            >
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowModelsDropdown(!showModelsDropdown);
                }}
                className="hover:text-black transition-colors flex items-center gap-1.5 uppercase cursor-pointer"
              >
                MODELS
                <span className="w-1 h-1 rounded-full bg-neutral-400 group-hover:bg-[#D5001C] transition-colors" />
              </button>

              {/* Models Dropdown */}
              {showModelsDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl border border-black/[0.08] shadow-2xl p-3 rounded-none flex flex-col space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      onSelectModel?.(0);
                      setShowModelsDropdown(false);
                      soundManager.playEngineRev("macan");
                    }}
                    className="text-left px-3 py-2 text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-100 hover:text-black flex justify-between items-center transition-colors"
                  >
                    <span>01 / MACAN</span>
                    <span className="text-[9px] text-neutral-400">GTS</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectModel?.(1);
                      setShowModelsDropdown(false);
                      soundManager.playEngineRev("boxster");
                    }}
                    className="text-left px-3 py-2 text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-100 hover:text-black flex justify-between items-center transition-colors"
                  >
                    <span>02 / 718 BOXSTER</span>
                    <span className="text-[9px] text-neutral-400">GTS 4.0</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectModel?.(2);
                      setShowModelsDropdown(false);
                      soundManager.playEngineRev("911");
                    }}
                    className="text-left px-3 py-2 text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-100 hover:text-black flex justify-between items-center transition-colors"
                  >
                    <span>03 / 911 CARRERA</span>
                    <span className="text-[9px] text-neutral-400">GT3</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick("boutique-store")}
              className="hover:text-black transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-black after:transition-all after:duration-300 uppercase cursor-pointer"
            >
              ACCESSORIES
            </button>

            <button
              onClick={() => handleNavClick("heritage-collections")}
              className="hover:text-black transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-black after:transition-all after:duration-300 uppercase cursor-pointer"
            >
              COLLECTIONS
            </button>
          </nav>

          {/* Top Center: Iconic PORSCHE Wordmark */}
          <div className="flex-1 lg:flex-initial text-left lg:text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                soundManager.playClick();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-block text-lg sm:text-xl md:text-2xl font-bold tracking-[0.34em] sm:tracking-[0.38em] text-neutral-950 hover:opacity-85 transition-opacity"
              style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
            >
              PORSCHE
            </a>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-3 sm:space-x-6 md:space-x-8 text-[10px] sm:text-[11px] font-medium tracking-[0.2em] sm:tracking-[0.25em] text-neutral-800">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
              className="p-1 text-neutral-600 hover:text-black transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-neutral-800 animate-pulse" />
              )}
              <span className="hidden xl:inline text-[9px] tracking-[0.2em] uppercase text-neutral-400">
                {isMuted ? "OFF" : "AUDIO"}
              </span>
            </button>

            {/* Search */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSearch();
              }}
              className="hover:text-black transition-colors flex items-center gap-2 uppercase cursor-pointer group"
            >
              <Search className="w-3.5 h-3.5 text-neutral-600 group-hover:text-black transition-colors" />
              <span className="hidden sm:inline">SEARCH</span>
            </button>

            {/* Bag */}
            <button
              onClick={() => {
                soundManager.playClick();
                openCart();
              }}
              className="hover:text-black transition-colors flex items-center gap-2 uppercase cursor-pointer group"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-neutral-600 group-hover:text-black transition-colors" />
              <span>
                BAG <span className="text-neutral-500 font-normal">({itemCount})</span>
              </span>
            </button>

            {/* Menu */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenMenu();
              }}
              className="hover:text-black transition-colors flex items-center gap-2 uppercase cursor-pointer group"
            >
              <div className="flex flex-col space-y-1 w-4">
                <span className="h-[1px] w-full bg-neutral-900 group-hover:bg-[#D5001C] transition-colors" />
                <span className="h-[1px] w-3/4 self-end bg-neutral-900 group-hover:w-full group-hover:bg-[#D5001C] transition-all" />
              </div>
              <span className="hidden md:inline">MENU</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
