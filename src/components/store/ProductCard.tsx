"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { soundManager } from "@/lib/audio";
import { Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {

  return (
    <div className="group relative flex flex-col bg-[#FFFFFF]/70 hover:bg-[#FFFFFF] dark:bg-[#121216]/80 dark:hover:bg-[#15151a] border border-black/[0.06] hover:border-black/[0.14] dark:border-white/[0.08] dark:hover:border-white/[0.18] transition-all duration-500 rounded-none overflow-hidden">
      {/* Product Image Stage */}
      <div
        onClick={() => {
          soundManager.playClick();
          onQuickView(product);
        }}
        className="relative aspect-square w-full bg-[#F4F4F6] dark:bg-[#18181D] overflow-hidden flex items-center justify-center p-8 cursor-pointer"
      >
        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-radial from-white/40 via-transparent to-black/[0.02] dark:from-white/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[9px] tracking-[0.25em] uppercase px-2.5 py-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-black/[0.06] dark:border-white/[0.1] text-neutral-800 dark:text-neutral-200 font-medium font-mono">
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick View Button on Image (Visible on mobile touch screens, hover on desktop) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            soundManager.playClick();
            onQuickView(product);
          }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:scale-105 active:scale-95 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-xs"
          title="Quick View"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* Product Image */}
        <div className="relative w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-[1.04]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6 flex flex-col flex-1 justify-between bg-white dark:bg-[#121216]">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span
              lang="fa"
              className="text-[11px] font-sans text-neutral-400 dark:text-neutral-500"
              style={{ letterSpacing: "normal" }}
            >
              {product.categoryLabel}
            </span>
            {product.compatibility && (
              <span className="truncate max-w-[150px] text-[10px] tracking-[0.15em] uppercase text-neutral-500 dark:text-neutral-400 font-mono">
                {product.compatibility}
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold tracking-[0.08em] text-neutral-900 dark:text-white uppercase">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 block font-mono text-[9px] uppercase tracking-wider">
              PRICE
            </span>
            <span className="text-sm font-medium tracking-tight text-neutral-900 dark:text-white font-mono">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={() => onQuickView(product)}
            className="flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase font-medium px-4 py-2.5 bg-neutral-900 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 transition-all duration-300 cursor-pointer group/btn"
          >
            <Eye className="w-3 h-3 text-neutral-400 dark:text-neutral-500 group-hover/btn:text-white dark:group-hover/btn:text-neutral-950 transition-colors" />
            <span>DISCOVER</span>
          </button>
        </div>
      </div>
    </div>
  );
}
