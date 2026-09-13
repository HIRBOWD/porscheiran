"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { PRODUCTS, Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { soundManager } from "@/lib/audio";
import { Search, X, ArrowUpRight } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectProduct }: SearchModalProps) {
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.modelLabel.toLowerCase().includes(q) ||
        (p.generationLabel && p.generationLabel.toLowerCase().includes(q)) ||
        p.compatibility?.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  const quickTerms = [
    "Macan",
    "Cayman",
    "Cayenne",
    "Boxster",
    "911",
    "Panamera",
    "اکسسوری",
    "فیس لیفت",
    "لوازم یدکی",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-28 px-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md"
        onClick={() => {
          soundManager.playClick();
          onClose();
        }}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#121216] border border-black/[0.08] dark:border-white/[0.1] shadow-2xl overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="p-6 md:p-8 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center gap-4">
          <Search className="w-5 h-5 text-neutral-400 dark:text-neutral-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در قطعات، تیپ‌ها و اکسسوری‌های پورشه..."
            autoFocus
            className="w-full text-sm md:text-base font-light tracking-[0.1em] uppercase text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none bg-transparent"
          />
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-6 md:px-8 py-3 bg-[#F8F8FA] dark:bg-[#18181D] border-b border-black/[0.04] dark:border-white/[0.06] flex items-center gap-2 overflow-x-auto text-[10px] tracking-[0.15em] uppercase text-neutral-500 dark:text-neutral-400 font-mono">
          <span className="text-neutral-400 dark:text-neutral-500">TRENDING:</span>
          {quickTerms.map((term) => (
            <button
              key={term}
              onClick={() => {
                soundManager.playClick();
                setQuery(term);
              }}
              className="px-2.5 py-1 bg-white dark:bg-[#202026] border border-black/[0.06] dark:border-white/[0.08] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors cursor-pointer whitespace-nowrap"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-6 md:p-8">
          {query.trim() === "" ? (
            <div className="py-12 text-center text-neutral-400 dark:text-neutral-500 font-mono text-xs uppercase tracking-widest">
              Type to search accessories, timepieces, lifestyle or vehicle equipment
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                NO ACCESSORIES FOUND FOR &quot;{query}&quot;
              </p>
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 font-light">
                Try searching for &quot;Watch&quot;, &quot;Bag&quot;, &quot;Soundbar&quot;, or &quot;Roof Box&quot;.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 border border-transparent hover:border-black/[0.05] dark:hover:border-white/[0.08] transition-all group"
                >
                  <div
                    onClick={() => {
                      onSelectProduct?.(product);
                      onClose();
                    }}
                    className="flex items-center gap-4 cursor-pointer flex-1"
                  >
                    <div className="relative w-14 h-14 bg-[#F4F4F6] dark:bg-[#18181D] shrink-0 p-1 flex items-center justify-center">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-contain"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                          {product.categoryLabel}
                        </span>
                        {product.compatibility && (
                          <span className="text-[8px] font-mono text-neutral-400 dark:text-neutral-500">
                            • {product.compatibility}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-semibold tracking-wider text-neutral-900 dark:text-white uppercase group-hover:text-black dark:group-hover:text-neutral-200">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-light truncate max-w-md">
                        {product.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-medium text-neutral-900 dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onSelectProduct?.(product);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-[9px] font-mono tracking-widest uppercase cursor-pointer"
                    >
                      VIEW
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
