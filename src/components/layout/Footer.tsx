"use client";

import React, { useState } from "react";
import { soundManager } from "@/lib/audio";
import { ArrowRight, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    soundManager.playClick();
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative w-full bg-[#111113] text-neutral-400 py-20 md:py-28 px-8 md:px-16 border-t border-neutral-800">
      <div className="max-w-[1720px] mx-auto">
        {/* Top Tier: Wordmark & Newsletter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-16 border-b border-neutral-800 gap-12">
          <div>
            <span className="text-2xl md:text-3xl font-bold tracking-[0.4em] text-white uppercase block mb-3 font-mono">
              PORSCHE
            </span>
            <span className="text-xs tracking-[0.25em] uppercase text-neutral-500 font-mono">
              TEQUIPMENT & ACCESSORIES BOUTIQUE
            </span>
          </div>

          {/* Newsletter Form */}
          <div className="w-full max-w-md">
            <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-mono block mb-2">
              DISPATCHES FROM WEISSACH
            </span>
            <p className="text-xs text-neutral-500 font-light mb-4">
              Receive private invitations to limited production allocations and bespoke design releases.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-xs font-mono text-white tracking-widest py-3 uppercase">
                <Check className="w-4 h-4 text-white" />
                <span>YOU ARE SUBSCRIBED TO PRIVATE DISPATCHES.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border-b border-neutral-700 focus-within:border-white transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL..."
                  required
                  className="w-full bg-transparent py-3 text-xs font-mono tracking-widest text-white uppercase placeholder:text-neutral-600 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="px-3 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Tier: Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-neutral-800 text-xs">
          <div>
            <h5 className="text-[10px] font-mono tracking-[0.25em] uppercase text-white font-medium mb-4">
              VEHICLE MODELS
            </h5>
            <ul className="space-y-2.5 font-light">
              <li><a href="#" className="hover:text-white transition-colors">Macan & Macan EV</a></li>
              <li><a href="#" className="hover:text-white transition-colors">718 Boxster & Cayman</a></li>
              <li><a href="#" className="hover:text-white transition-colors">911 Carrera & GT3</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Taycan Cross Turismo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Panamera & Cayenne</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-mono tracking-[0.25em] uppercase text-white font-medium mb-4">
              ACCESSORIES
            </h5>
            <ul className="space-y-2.5 font-light">
              <li><a href="#boutique-store" className="hover:text-white transition-colors">Timepieces & Watches</a></li>
              <li><a href="#boutique-store" className="hover:text-white transition-colors">Luggage & Heritage Bags</a></li>
              <li><a href="#boutique-store" className="hover:text-white transition-colors">Motorsport Technical Apparel</a></li>
              <li><a href="#boutique-store" className="hover:text-white transition-colors">Performance Roof Boxes</a></li>
              <li><a href="#boutique-store" className="hover:text-white transition-colors">Original GT3 Soundbars</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-mono tracking-[0.25em] uppercase text-white font-medium mb-4">
              CLIENT SERVICES
            </h5>
            <ul className="space-y-2.5 font-light">
              <li><a href="#" className="hover:text-white transition-colors">Porsche Concierge</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tequipment Installation Centers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Complimentary White-Glove Care</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Certificate of Authenticity</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Warranty & Service Records</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-mono tracking-[0.25em] uppercase text-white font-medium mb-4">
              BOUTIQUE HUBS
            </h5>
            <ul className="space-y-2.5 font-light font-mono text-[11px]">
              <li>Zuffenhausen, Stuttgart</li>
              <li>Rodeo Drive, Beverly Hills</li>
              <li>Ginza, Tokyo</li>
              <li>Bahnhofstrasse, Zurich</li>
              <li>Bond Street, London</li>
            </ul>
          </div>
        </div>

        {/* Bottom Tier: Legal & Copyright */}
        <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-mono tracking-widest text-neutral-600">
          <div>
            © {new Date().getFullYear()} Dr. Ing. h.c. F. Porsche AG. All Rights Reserved.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="hover:text-neutral-400 transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-neutral-400 transition-colors">TERMS OF SALE</a>
            <a href="#" className="hover:text-neutral-400 transition-colors">COOKIE SETTINGS</a>
            <a href="#" className="hover:text-neutral-400 transition-colors">COMPLIANCE & LEGAL</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
