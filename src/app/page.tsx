"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CinematicScroll from "@/components/hero/CinematicScroll";
import StoreSection from "@/components/store/StoreSection";
import HeritageBanner from "@/components/editorial/HeritageBanner";
import Manifesto from "@/components/editorial/Manifesto";
import CartDrawer from "@/components/layout/CartDrawer";
import SearchModal from "@/components/layout/SearchModal";
import MobileMenu from "@/components/layout/MobileMenu";
import ProductQuickView from "@/components/store/ProductQuickView";
import { Product } from "@/data/products";

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSelectModel = (_index: number = 0) => {
    // Smooth scroll to top of the pinned 3D showroom
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="relative min-h-screen bg-[#F6F6F8] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
        onSelectModel={handleSelectModel}
      />

      {/* Hero: Real-Time 3D WebGL Boxster Cinematic Showcase */}
      <CinematicScroll />

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
      <CartDrawer />

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
