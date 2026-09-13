"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { soundManager } from "@/lib/audio";
import { X, Check, ShieldCheck, Truck, RotateCcw } from "lucide-react";

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductQuickView({ product, onClose }: ProductQuickViewProps) {

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-md"
        onClick={() => {
          soundManager.playClick();
          onClose();
        }}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#121216] border border-black/[0.08] dark:border-white/[0.1] shadow-2xl overflow-y-auto md:overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2 max-h-[88vh] md:max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border border-black/[0.08] dark:border-white/[0.1] rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Panel */}
        <div className="relative aspect-[4/3] md:aspect-auto w-full bg-[#F4F4F6] dark:bg-[#18181D] p-6 md:p-12 flex items-center justify-center">
          <div className="relative w-full h-full min-h-[200px] sm:min-h-[260px] md:min-h-[300px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />
          </div>

          {product.badge && (
            <div className="absolute top-6 left-6">
              <span className="text-[10px] tracking-[0.25em] uppercase px-3 py-1 bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.1] text-neutral-900 dark:text-white font-medium font-mono">
                {product.badge}
              </span>
            </div>
          )}
        </div>

        {/* Product Information Panel */}
        <div className="p-6 md:p-10 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span
                lang="fa"
                className="text-[11px] font-sans text-neutral-400 dark:text-neutral-500"
                style={{ letterSpacing: "normal" }}
              >
                {product.categoryLabel}
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 dark:text-neutral-500 font-mono">
                AUTHENTIC TEQUIPMENT
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-semibold tracking-[0.08em] text-neutral-900 dark:text-white uppercase">
              {product.name}
            </h2>

            <p className="text-xs text-neutral-400 dark:text-neutral-500 font-mono uppercase tracking-wider mt-1">
              {product.subtitle}
            </p>

            <div className="mt-4 text-xl font-medium text-neutral-900 dark:text-white font-mono">
              {formatPrice(product.price)}
            </div>

            <div className="mt-6 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
              {product.description}
            </div>

            {/* Features */}
            <div className="mt-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
              <h4 className="text-[10px] tracking-[0.25em] font-medium text-neutral-900 dark:text-white uppercase mb-3">
                Key Specifications
              </h4>
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900 dark:text-white mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Material & Dimension info */}
            <div className="mt-6 space-y-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
              <div>
                <strong className="text-neutral-700 dark:text-neutral-300">MATERIALS:</strong> {product.materials}
              </div>
              {product.dimensions && (
                <div>
                  <strong className="text-neutral-700 dark:text-neutral-300">DIMENSIONS:</strong> {product.dimensions}
                </div>
              )}
            </div>
          </div>

          {/* Action & Assurances */}
          <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="w-full py-3.5 bg-neutral-950 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-[11px] font-medium tracking-[0.25em] uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>INQUIRE AT PORSCHE CENTRE</span>
            </button>

            {/* Showroom Guarantees */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[9px] tracking-[0.15em] uppercase text-neutral-400 dark:text-neutral-500">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                <span>2-YEAR WARRANTY</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                <span>WHITE GLOVE SHIPPING</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                <span>30-DAY RETURN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
