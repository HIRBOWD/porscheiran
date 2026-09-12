"use client";

import React, { useState, useMemo } from "react";
import { CATEGORIES, PRODUCTS, Product } from "@/data/products";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";
import { soundManager } from "@/lib/audio";
import { SlidersHorizontal } from "lucide-react";

export default function StoreSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const filteredProducts = useMemo(() => {
    let list =
      selectedCategory === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === selectedCategory);

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [selectedCategory, sortBy]);

  return (
    <section id="boutique-store" className="relative w-full bg-[#F6F6F8] dark:bg-[#0B0B0D] py-24 md:py-32 px-6 md:px-12 border-t border-black/[0.06] dark:border-white/[0.08]">
      <div className="max-w-[1720px] mx-auto">
        {/* Section Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-black/[0.06] dark:border-white/[0.08] gap-6">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-500 font-mono block mb-3">
              02 / PORSCHE TEQUIPMENT & DESIGN
            </span>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.1em] text-neutral-950 dark:text-white uppercase">
              THE ACCESSORIES <span className="font-semibold">BOUTIQUE</span>
            </h2>
            <p className="mt-3 text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-light max-w-xl leading-relaxed">
              Engineered in Weissach, crafted without compromise. Precision lifestyle artifacts and vehicle enhancement equipment designed to elevate every journey.
            </p>
          </div>

          {/* Sort selection */}
          <div className="flex items-center space-x-3 text-[11px] font-mono tracking-wider text-neutral-500 dark:text-neutral-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
            <span>SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                soundManager.playClick();
                setSortBy(e.target.value as "featured" | "price-asc" | "price-desc");
              }}
              aria-label="Sort products"
              className="bg-transparent text-neutral-900 dark:text-neutral-100 font-medium focus:outline-none cursor-pointer uppercase text-[10px] tracking-[0.15em]"
            >
              <option value="featured" className="bg-white dark:bg-[#121216] text-neutral-900 dark:text-neutral-100">Featured Curations</option>
              <option value="price-asc" className="bg-white dark:bg-[#121216] text-neutral-900 dark:text-neutral-100">Price: Low to High</option>
              <option value="price-desc" className="bg-white dark:bg-[#121216] text-neutral-900 dark:text-neutral-100">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Minimal Luxury Filter Bar */}
        <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`text-[10px] md:text-[11px] font-medium tracking-[0.22em] uppercase px-5 py-2.5 transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-black shadow-sm"
                    : "bg-white/80 dark:bg-[#141418]/80 hover:bg-white dark:hover:bg-[#1c1c22] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-black/[0.05] dark:border-white/[0.08]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* Quick View Modal */}
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </section>
  );
}
