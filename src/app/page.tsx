"use client";

import React, { useRef, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CinematicScroll from "@/components/hero/CinematicScroll";
import HeroScrollCapsule from "@/components/hero/HeroScrollCapsule";
import StoreSection from "@/components/store/StoreSection";
import HeritageBanner from "@/components/editorial/HeritageBanner";
import Manifesto from "@/components/editorial/Manifesto";
import SearchModal from "@/components/layout/SearchModal";
import MobileMenu from "@/components/layout/MobileMenu";
import ProductQuickView from "@/components/store/ProductQuickView";
import { Product } from "@/data/products";

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Shared scroll progress ref connecting ScrollTrigger to both 3D Hero and Global Capsule
  const scrollProgressRef = useRef(0);

  const handleNavigateSection = (targetProgress: number) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const runwayDistance = isMobile ? 700 : 750;
    const lenis = typeof window !== "undefined" ? (window as any).__lenis : null;

    if (targetProgress >= 0.95) {
      const storeEl = document.getElementById("boutique-store");
      if (storeEl) {
        if (lenis) {
          lenis.scrollTo(storeEl);
        } else {
          storeEl.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }
    }

    const targetY = targetProgress * runwayDistance;
    if (lenis) {
      lenis.scrollTo(targetY);
    } else {
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  };

  const handleSelectModel = (_index: number = 0) => {
    // Smooth scroll to top of the pinned 3D showroom
    const lenis = typeof window !== "undefined" ? (window as any).__lenis : null;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="relative min-h-screen bg-[#F6F6F8] dark:bg-[#0B0B0D] text-neutral-900 dark:text-neutral-100 selection:bg-neutral-900 dark:selection:bg-white selection:text-white dark:selection:text-neutral-950 transition-colors duration-300">
      {/* Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onSelectModel={handleSelectModel}
      />

      {/* Hero: Real-Time 3D WebGL 911 GT3 RS Cinematic Showcase */}
      <CinematicScroll scrollProgressRef={scrollProgressRef} />

      {/* Persistent Global Floating Capsule across the entire website */}
      <HeroScrollCapsule
        scrollProgressRef={scrollProgressRef}
        onNavigateSection={handleNavigateSection}
      />

      {/* 1px Architectural Physical Separation Layer */}
      <div className="arch-separator" />

      {/* Accessories Boutique */}
      <StoreSection />

      {/* Curated Heritage & Motorsport Collections */}
      <HeritageBanner />

      {/* Ferry Porsche Craftsmanship Manifesto */}
      <Manifesto />

      {/* Showroom Boutique Footer */}
      <Footer />

      {/* Drawers & Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => setSelectedProduct(product)}
      />

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectModel={handleSelectModel}
      />

      <ProductQuickView
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}
