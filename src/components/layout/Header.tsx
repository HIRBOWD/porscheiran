"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { soundManager } from "@/lib/audio";
import { Search, Sun, Moon, Menu } from "lucide-react";

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  onSelectModel?: (index: number) => void;
}

export default function Header({ onOpenSearch, onOpenMenu, onSelectModel }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? "bg-[#F6F6F8]/85 dark:bg-[#0B0B0D]/85 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.08] py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          : "bg-transparent py-6 md:py-7 border-b border-black/[0.03] dark:border-white/[0.04]"
          }`}
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
          {/* Left: Porsche Iran Crest Logo & Desktop Nav Links */}
          <div className="flex items-center space-x-5 lg:space-x-8">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                soundManager.playClick();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center group transition-transform hover:scale-105 cursor-pointer"
              aria-label="Porsche Iran Home"
            >
              <img
                src="/images/porsche-iran-crest.png"
                alt="Porsche Iran Crest"
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain drop-shadow-md"
              />
            </a>

            <nav className="hidden lg:flex items-center space-x-8 text-[11px] font-medium tracking-[0.25em] text-neutral-800 dark:text-neutral-200">
              <button
                onClick={() => handleNavClick("boutique-store")}
                className="hover:text-black dark:hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-black dark:after:bg-white after:transition-all after:duration-300 uppercase cursor-pointer"
              >
                ACCESSORIES
              </button>

              <button
                onClick={() => handleNavClick("heritage-collections")}
                className="hover:text-black dark:hover:text-white transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-black dark:after:bg-white after:transition-all after:duration-300 uppercase cursor-pointer"
              >
                CLUB
              </button>
            </nav>
          </div>

          {/* Top Center: Iconic PORSCHE IRAN Wordmark */}
          <div className="flex-1 text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                soundManager.playClick();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-block text-base sm:text-xl md:text-2xl font-bold tracking-[0.24em] sm:tracking-[0.32em] text-neutral-950 dark:text-white hover:opacity-85 transition-opacity"
              style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
            >
              PORSCHE IRAN
            </a>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-3 sm:space-x-6 md:space-x-8 text-[10px] sm:text-[11px] font-medium tracking-[0.2em] sm:tracking-[0.25em] text-neutral-800 dark:text-neutral-200">
            {/* Theme Toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                toggleTheme();
              }}
              title={isDark ? "تغییر به حالت روشن" : "تغییر به حالت تیره"}
              aria-label={isDark ? "روشن" : "تیره"}
              className="p-1 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300 hover:-rotate-12 transition-transform" />
              )}
              <span
                lang="fa"
                className="hidden xl:inline text-[11px] text-neutral-400 dark:text-neutral-500 font-sans"
                style={{ letterSpacing: "normal" }}
              >
                {isDark ? "روشن" : "تیره"}
              </span>
            </button>

            {/* جستجو */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSearch();
              }}
              className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer group"
            >
              <Search className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
              <span
                lang="fa"
                className="hidden sm:inline text-[12px] font-sans font-normal"
                style={{ letterSpacing: "normal" }}
              >
                جستجو
              </span>
            </button>

            {/* Menu */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenMenu();
              }}
              className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 uppercase cursor-pointer group"
            >
              <div className="flex flex-col space-y-1 w-4">
                <span className="h-[1px] w-full bg-neutral-900 dark:bg-neutral-100 group-hover:bg-[#D5001C] transition-colors" />
                <span className="h-[1px] w-3/4 self-end bg-neutral-900 dark:bg-neutral-100 group-hover:w-full group-hover:bg-[#D5001C] transition-all" />
              </div>
              <span className="hidden md:inline">MENU</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
