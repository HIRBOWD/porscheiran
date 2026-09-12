"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { soundManager } from "@/lib/audio";
import { X, Minus, Plus, Trash2, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const freeShippingThreshold = 500;
  const freeShippingMet = subtotal >= freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    soundManager.playClick();
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      clearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm transition-opacity"
        onClick={() => {
          soundManager.playClick();
          closeCart();
          setOrderComplete(false);
        }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-white dark:bg-[#121216] shadow-2xl border-l border-black/[0.08] dark:border-white/[0.1] flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-sm font-semibold tracking-[0.25em] text-neutral-900 dark:text-white uppercase">
                YOUR BAG
              </h2>
              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">({itemCount} ITEMS)</span>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                closeCart();
                setOrderComplete(false);
              }}
              className="p-2 text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Complimentary Shipping Progress Bar */}
          <div className="px-6 py-3 bg-[#F6F6F8] dark:bg-[#18181D] border-b border-black/[0.04] dark:border-white/[0.06] text-[10px] tracking-wider uppercase text-neutral-600 dark:text-neutral-300">
            {freeShippingMet ? (
              <div className="flex items-center gap-1.5 text-neutral-900 dark:text-white font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                <span>COMPLIMENTARY WHITE-GLOVE SHIPPING UNLOCKED</span>
              </div>
            ) : (
              <div>
                <span>
                  ADD <strong className="text-neutral-900 dark:text-white font-mono">{formatPrice(amountToFreeShipping)}</strong> MORE FOR COMPLIMENTARY SHIPPING
                </span>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 mt-2 rounded-full overflow-hidden">
                  <div
                    className="bg-neutral-900 dark:bg-white h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {orderComplete ? (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-black/10 dark:border-white/10 flex items-center justify-center text-neutral-900 dark:text-white mb-4">
                  <CheckCircle2 className="w-7 h-7 text-neutral-900 dark:text-white" />
                </div>
                <h3 className="text-base font-semibold tracking-[0.15em] text-neutral-900 dark:text-white uppercase">
                  ORDER INITIATED
                </h3>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed">
                  Thank you for your acquisition. Your dedicated Porsche Client Advisor will contact you shortly with tracking details.
                </p>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setOrderComplete(false);
                    closeCart();
                  }}
                  className="mt-8 px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-[10px] tracking-[0.2em] uppercase font-medium cursor-pointer"
                >
                  RETURN TO SHOWROOM
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
                  YOUR SHOPPING BAG IS CURRENTLY EMPTY
                </p>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed font-light">
                  Explore our curated selection of authentic Tequipment accessories and design pieces.
                </p>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex space-x-4 pb-6 border-b border-black/[0.05] dark:border-white/[0.06] last:border-b-0"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 bg-[#F4F4F6] dark:bg-[#18181D] shrink-0 p-2 flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold tracking-wider text-neutral-900 dark:text-white uppercase">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono uppercase mt-0.5">
                        {product.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Modifier */}
                      <div className="flex items-center border border-black/[0.08] dark:border-white/[0.1]">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="px-3 text-xs font-mono text-neutral-900 dark:text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <span className="text-xs font-medium text-neutral-900 dark:text-white font-mono">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout CTA */}
          {items.length > 0 && !orderComplete && (
            <div className="p-6 border-t border-black/[0.06] dark:border-white/[0.08] bg-[#FAFAFA] dark:bg-[#0E0E12]">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  <span>SUBTOTAL</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  <span>ESTIMATED DELIVERY</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{freeShippingMet ? "COMPLIMENTARY" : "$45.00"}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-neutral-950 dark:text-white font-mono pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                  <span>TOTAL ESTIMATE</span>
                  <span>{formatPrice(subtotal + (freeShippingMet ? 0 : 45))}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-neutral-950 hover:bg-black dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 text-[11px] font-medium tracking-[0.25em] uppercase transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>CONNECTING TO CONCIERGE...</span>
                ) : (
                  <>
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] tracking-widest text-neutral-400 dark:text-neutral-500 uppercase font-mono">
                <ShieldCheck className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                <span>OFFICIAL PORSCHE BOUTIQUE GUARANTEE</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
