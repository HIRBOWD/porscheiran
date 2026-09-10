"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { soundManager } from "@/lib/audio";
import { Eye, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group relative flex flex-col bg-[#FFFFFF]/70 hover:bg-[#FFFFFF] border border-black/[0.06] hover:border-black/[0.14] transition-all duration-500 rounded-none overflow-hidden">
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-[#F4F4F6] overflow-hidden flex items-center justify-center p-8">
        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-radial from-white/40 via-transparent to-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="text-[9px] tracking-[0.25em] uppercase px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-black/[0.06] text-neutral-800 font-medium">
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick View Button on Image */}
        <button
          onClick={() => {
            soundManager.playClick();
            onQuickView(product);
          }}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-black/[0.06] flex items-center justify-center text-neutral-600 hover:text-black hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer shadow-sm"
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
      <div className="p-6 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-mono mb-2">
            <span>{product.categoryLabel}</span>
            {product.compatibility && (
              <span className="truncate max-w-[150px] text-neutral-500">
                {product.compatibility}
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold tracking-[0.08em] text-neutral-900 uppercase">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-black/[0.05] flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 block font-mono text-[9px] uppercase tracking-wider">
              PRICE
            </span>
            <span className="text-sm font-medium tracking-tight text-neutral-900 font-mono">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase font-medium px-4 py-2.5 bg-neutral-900 hover:bg-black text-white hover:text-white transition-all duration-300 cursor-pointer group/btn"
          >
            <Plus className="w-3 h-3 text-neutral-400 group-hover/btn:text-white transition-colors" />
            <span>ADD TO BAG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
