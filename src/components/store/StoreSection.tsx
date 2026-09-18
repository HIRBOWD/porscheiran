"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  VEHICLE_CATEGORIES,
  SUB_CATEGORIES,
  PRODUCTS,
  Product,
  SubCategoryId,
  VehicleModelCategory,
  ModelGeneration,
} from "@/data/products";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";
import { soundManager } from "@/lib/audio";
import {
  ChevronRight,
  ChevronDown,
  Check,
  RotateCcw,
  X,
} from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function StoreSection() {
  const [selectedModel, setSelectedModel] = useState<string>("none");
  const [selectedGeneration, setSelectedGeneration] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryId>("all");
  const [openDropdownModel, setOpenDropdownModel] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const modelRowRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modelRowRef.current &&
        !modelRowRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownModel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (openDropdownModel && typeof window !== "undefined" && window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openDropdownModel]);

  // Active vehicle model object
  const activeModelObj = useMemo(() => {
    if (selectedModel === "none") return null;
    return VEHICLE_CATEGORIES.find((c) => c.id === selectedModel);
  }, [selectedModel]);

  // Model object whose dropdown is open
  const openModelObj = useMemo(() => {
    return VEHICLE_CATEGORIES.find((c) => c.id === openDropdownModel);
  }, [openDropdownModel]);

  // Filtered products: remains empty when "none" (هیچکدام) is selected
  const filteredProducts = useMemo(() => {
    if (selectedModel === "none") {
      return [];
    }

    let list = PRODUCTS.filter((p) => p.model === selectedModel);

    if (selectedGeneration !== "all") {
      list = list.filter((p) => p.generation === selectedGeneration);
    }

    if (selectedSubCategory !== "all") {
      list = list.filter((p) => p.category === selectedSubCategory);
    }

    return list;
  }, [selectedModel, selectedGeneration, selectedSubCategory]);

  // Recalculate smooth scroll bounds whenever category filtering changes product count & DOM height
  useEffect(() => {
    const refreshScroll = () => {
      const lenis = typeof window !== "undefined" ? (window as any).__lenis : null;
      if (lenis) {
        lenis.resize();
      }
      ScrollTrigger.refresh();
    };

    refreshScroll();
    const rId = requestAnimationFrame(refreshScroll);
    const t1 = setTimeout(refreshScroll, 100);
    const t2 = setTimeout(refreshScroll, 350);

    return () => {
      cancelAnimationFrame(rId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [selectedModel, selectedGeneration, selectedSubCategory, filteredProducts.length]);

  const handleSelectNone = () => {
    soundManager.playClick();
    setSelectedModel("none");
    setSelectedGeneration("all");
    setSelectedSubCategory("all");
    setOpenDropdownModel(null);
  };

  const handleModelClick = (modelId: string) => {
    soundManager.playClick();
    if (selectedModel !== modelId) {
      setSelectedModel(modelId);
      setSelectedGeneration("all");
      setSelectedSubCategory("all");
      setOpenDropdownModel(modelId);
    } else {
      setOpenDropdownModel(openDropdownModel === modelId ? null : modelId);
    }
  };

  const handleSelectSubOption = (
    modelId: string,
    genId: string = "all",
    subCat: SubCategoryId = "all"
  ) => {
    soundManager.playClick();
    setSelectedModel(modelId);
    setSelectedGeneration(genId);
    setSelectedSubCategory(subCat);
    setOpenDropdownModel(null);
  };

  const handleResetFilters = () => {
    soundManager.playClick();
    setSelectedGeneration("all");
    setSelectedSubCategory("all");
  };

  // Helper to render dropdown items for desktop or mobile
  const renderDropdownContent = (m: VehicleModelCategory, isMobile: boolean = false) => {
    const isModelAllSelected =
      selectedModel === m.id &&
      selectedGeneration === "all" &&
      selectedSubCategory === "all";

    return (
      <div className={isMobile ? "space-y-3" : "p-2"}>
        {/* Header (Desktop Only) */}
        {!isMobile && (
          <div className="px-3 py-1.5 border-b border-black/[0.06] dark:border-white/[0.08] mb-1 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              {m.name} Catalog
            </span>
            <span
              lang="fa"
              className="text-[9px] font-sans text-neutral-400"
              style={{ letterSpacing: "normal" }}
            >
              پورشه
            </span>
          </div>
        )}

        {/* All Items Option */}
        <button
          onClick={() => handleSelectSubOption(m.id, "all", "all")}
          className={`w-full text-right flex items-center justify-between transition-colors cursor-pointer ${
            isMobile
              ? "px-4 py-3 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-sm"
              : "px-3 py-2 text-xs"
          } ${
            isModelAllSelected
              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold"
              : isMobile
              ? "bg-neutral-50 dark:bg-white/[0.04] text-neutral-800 dark:text-neutral-200"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5"
          }`}
        >
          <span
            lang="fa"
            className="font-sans"
            style={{ letterSpacing: "normal" }}
          >
            همه قطعات و اکسسوری‌های {m.name}
          </span>
          {isModelAllSelected && <Check className="w-4 h-4 text-[#D5001C]" />}
        </button>

        {/* Case 1: Model with Generations (Cayenne, Boxster, 911) */}
        {m.generations && m.generations.length > 0 ? (
          <div className={`space-y-3 ${isMobile ? "mt-4" : "mt-2"}`}>
            {m.generations.map((gen: ModelGeneration) => (
              <div
                key={gen.id}
                className={
                  isMobile
                    ? "p-3 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.01] dark:bg-white/[0.02]"
                    : "pt-2 border-t border-black/[0.05] dark:border-white/[0.06]"
                }
              >
                <div className="px-2 py-1 flex items-center justify-between mb-1.5">
                  <span className="text-[11px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {gen.name}
                  </span>
                  <button
                    onClick={() => handleSelectSubOption(m.id, gen.id, "all")}
                    lang="fa"
                    className="text-[11px] sm:text-[10px] font-sans text-neutral-400 hover:text-black dark:hover:text-white underline cursor-pointer"
                    style={{ letterSpacing: "normal" }}
                  >
                    مشاهده همه این تیپ
                  </button>
                </div>

                <div className="space-y-1">
                  {SUB_CATEGORIES.map((sub) => {
                    const isOptionActive =
                      selectedModel === m.id &&
                      selectedGeneration === gen.id &&
                      selectedSubCategory === sub.id;
                    return (
                      <button
                        key={`${gen.id}-${sub.id}`}
                        onClick={() =>
                          handleSelectSubOption(m.id, gen.id, sub.id)
                        }
                        className={`w-full text-right flex items-center justify-between transition-colors cursor-pointer ${
                          isMobile
                            ? "px-3.5 py-2.5 rounded-md text-sm"
                            : "px-3 py-1.5 text-xs"
                        } ${
                          isOptionActive
                            ? "bg-neutral-100 dark:bg-white/10 text-[#D5001C] dark:text-[#ff4d4d] font-semibold"
                            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5"
                        }`}
                      >
                        <span
                          lang="fa"
                          className="font-sans"
                          style={{ letterSpacing: "normal" }}
                        >
                          {sub.label}
                        </span>
                        {isOptionActive && (
                          <Check className="w-4 h-4 text-[#D5001C]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Case 2: Model without Generations (Macan, Cayman, Panamera) */
          <div
            className={`space-y-1 ${
              isMobile
                ? "mt-2 pt-1"
                : "mt-1 pt-1 border-t border-black/[0.05] dark:border-white/[0.06]"
            }`}
          >
            {SUB_CATEGORIES.map((sub) => {
              const isOptionActive =
                selectedModel === m.id && selectedSubCategory === sub.id;
              return (
                <button
                  key={`single-${m.id}-${sub.id}`}
                  onClick={() => handleSelectSubOption(m.id, "all", sub.id)}
                  className={`w-full text-right flex items-center justify-between transition-colors cursor-pointer ${
                    isMobile
                      ? "px-4 py-3 rounded-lg border border-black/[0.06] dark:border-white/[0.06] text-sm"
                      : "px-3 py-2 text-xs"
                  } ${
                    isOptionActive
                      ? "bg-neutral-100 dark:bg-white/10 text-[#D5001C] dark:text-[#ff4d4d] font-semibold"
                      : isMobile
                      ? "bg-neutral-50 dark:bg-white/[0.02] text-neutral-700 dark:text-neutral-300"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5"
                  }`}
                >
                  <span
                    lang="fa"
                    className="font-sans"
                    style={{ letterSpacing: "normal" }}
                  >
                    {sub.label}
                  </span>
                  {isOptionActive && (
                    <Check className="w-4 h-4 text-[#D5001C]" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      id="boutique-store"
      className="relative w-full bg-[#F6F6F8] dark:bg-[#0B0B0D] py-20 md:py-32 px-4 sm:px-6 md:px-12 border-t border-black/[0.06] dark:border-white/[0.08]"
    >
      <div className="max-w-[1720px] mx-auto">
        {/* Section Editorial Header */}
        <div className="mb-10 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-500 font-mono block mb-3">
            02 / PORSCHE TEQUIPMENT
          </span>
          <h2
            lang="fa"
            className="text-2xl sm:text-4xl md:text-5xl font-normal text-neutral-950 dark:text-white font-sans"
            style={{ letterSpacing: "normal" }}
          >
            اکسسوری‌ها و قطعات
          </h2>
          <p
            lang="fa"
            className="mt-3 text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-light max-w-2xl leading-relaxed font-sans"
            style={{ letterSpacing: "normal" }}
          >
            قطعات یدکی و مصرفی ، پکیجهای فیسلیفت
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* VEHICLE MODEL SELECTOR                                             */}
        {/* ------------------------------------------------------------------ */}
        <div id="products-catalog-grid" className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                lang="fa"
                className="text-[10px] sm:text-[11px] font-sans text-neutral-400 dark:text-neutral-500 font-semibold"
                style={{ letterSpacing: "normal" }}
              >
                انتخاب مدل خودرو و دسته‌بندی قطعات
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 dark:text-neutral-500 font-semibold">
                (SELECT VEHICLE MODEL & CATEGORY)
              </span>
            </div>
          </div>

          {/* ================================================================ */}
          {/* MOBILE OPTIMIZED LAYOUT (< sm): Clean 2-Column Grid + None Bar   */}
          {/* ================================================================ */}
          <div className="block sm:hidden space-y-2">
            {/* Mobile "None" (هیچکدام) Full-Width Button */}
            <button
              onClick={handleSelectNone}
              className={`w-full flex items-center justify-between text-xs px-4 py-3 transition-all cursor-pointer border ${
                selectedModel === "none"
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-xs font-semibold"
                  : "bg-white dark:bg-[#141418] text-neutral-700 dark:text-neutral-300 border-black/[0.08] dark:border-white/[0.08] active:bg-neutral-100 dark:active:bg-white/5"
              }`}
            >
              <span
                lang="fa"
                className="font-sans"
                style={{ letterSpacing: "normal" }}
              >
                هیچکدام (بدون انتخاب مدل)
              </span>
              {selectedModel === "none" && <Check className="w-4 h-4 text-[#D5001C]" />}
            </button>

            {/* Mobile 2-Column Model Grid: All 6 models visible at a glance */}
            <div className="grid grid-cols-2 gap-2">
              {VEHICLE_CATEGORIES.map((m) => {
                const isSelected = selectedModel === m.id;
                return (
                  <button
                    key={`mobile-${m.id}`}
                    onClick={() => handleModelClick(m.id)}
                    className={`flex items-center justify-between text-xs font-mono tracking-[0.15em] uppercase px-3.5 py-3 transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-xs font-semibold"
                        : "bg-white dark:bg-[#141418] text-neutral-700 dark:text-neutral-300 border-black/[0.08] dark:border-white/[0.08] active:bg-neutral-100 dark:active:bg-white/5"
                    }`}
                  >
                    <span className="truncate">{m.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                        isSelected
                          ? "text-white dark:text-neutral-950"
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================================ */}
          {/* DESKTOP LAYOUT (>= sm): Elegant Horizontal Flex Tab Bar          */}
          {/* ================================================================ */}
          <div
            ref={modelRowRef}
            className="hidden sm:flex flex-wrap items-center gap-2.5"
          >
            {/* Desktop "None" (هیچکدام) Option */}
            <div className="relative">
              <button
                onClick={handleSelectNone}
                className={`text-xs px-4 py-2.5 transition-all cursor-pointer whitespace-nowrap border ${
                  selectedModel === "none"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-xs font-semibold"
                    : "bg-white dark:bg-[#141418] text-neutral-700 dark:text-neutral-300 border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.2] dark:hover:border-white/[0.2]"
                }`}
              >
                <span
                  lang="fa"
                  className="font-sans"
                  style={{ letterSpacing: "normal" }}
                >
                  هیچکدام
                </span>
              </button>
            </div>

            {/* Desktop Vehicle Model Tabs with Popovers */}
            {VEHICLE_CATEGORIES.map((m, index) => {
              const isSelected = selectedModel === m.id;
              const isDropdownOpen = openDropdownModel === m.id;
              const isRightAligned = index >= 3;

              return (
                <div key={m.id} className="relative">
                  {/* Model Tab Button with Dropdown Chevron */}
                  <button
                    onClick={() => handleModelClick(m.id)}
                    aria-expanded={isDropdownOpen}
                    className={`flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase px-4 py-2.5 transition-all cursor-pointer whitespace-nowrap border ${
                      isSelected
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-xs"
                        : "bg-white dark:bg-[#141418] text-neutral-700 dark:text-neutral-300 border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.2] dark:hover:border-white/[0.2]"
                    }`}
                  >
                    <span className="font-semibold">{m.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      } ${
                        isSelected
                          ? "text-white dark:text-neutral-950"
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    />
                  </button>

                  {/* Desktop Dropdown Popover */}
                  {isDropdownOpen && (
                    <div
                      className={`absolute top-full mt-2 z-40 min-w-[260px] sm:min-w-[280px] max-h-[70vh] overflow-y-auto bg-white dark:bg-[#121216] border border-black/[0.1] dark:border-white/[0.12] shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
                        isRightAligned ? "right-0" : "left-0"
                      }`}
                    >
                      {renderDropdownContent(m, false)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* MOBILE OPTIMIZED BOTTOM SHEET DRAWER (PHONE ONLY) - PRESERVED      */}
        {/* ------------------------------------------------------------------ */}
        {openModelObj && (
          <div className="sm:hidden">
            {/* Backdrop */}
            <div
              onClick={() => setOpenDropdownModel(null)}
              className="fixed inset-0 bg-black/65 backdrop-blur-xs z-50 animate-in fade-in duration-200"
            />

            {/* Bottom Sheet Drawer */}
            <div className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-[#121216] border-t border-black/[0.1] dark:border-white/[0.15] rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-250">
              {/* Handle Bar */}
              <div className="pt-3 pb-1 flex justify-center">
                <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
              </div>

              {/* Sheet Header */}
              <div className="px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 dark:text-neutral-500 block">
                    PORSCHE {openModelObj.name}
                  </span>
                  <h3
                    lang="fa"
                    className="text-sm font-semibold font-sans text-neutral-900 dark:text-white"
                    style={{ letterSpacing: "normal" }}
                  >
                    انتخاب دسته‌بندی و قطعات
                  </h3>
                </div>
                <button
                  onClick={() => setOpenDropdownModel(null)}
                  className="p-1.5 rounded-full text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="بستن منو"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sheet Scrollable Options */}
              <div className="overflow-y-auto px-4 py-4 pb-10">
                {renderDropdownContent(openModelObj, true)}
              </div>
            </div>
          </div>
        )}

        {/* Active Filter State Summary & Reset (Shown only when a model is selected) */}
        {selectedModel !== "none" && (
          <div className="flex items-center justify-between py-3 px-4 mb-8 bg-neutral-100 dark:bg-[#15151a] border border-black/[0.06] dark:border-white/[0.08] text-xs text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                lang="fa"
                className="text-neutral-400 font-sans"
                style={{ letterSpacing: "normal" }}
              >
                مدل و دسته‌بندی انتخاب شده:
              </span>
              <span className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                {activeModelObj?.name || selectedModel.toUpperCase()}
              </span>
              {selectedGeneration !== "all" && (
                <>
                  <ChevronRight className="w-3 h-3 text-neutral-400" />
                  <span className="font-medium text-neutral-800 dark:text-neutral-200 font-mono">
                    {activeModelObj?.generations?.find((g) => g.id === selectedGeneration)?.name || selectedGeneration}
                  </span>
                </>
              )}
              {selectedSubCategory !== "all" && (
                <>
                  <ChevronRight className="w-3 h-3 text-neutral-400" />
                  <span
                    lang="fa"
                    className="font-semibold text-[#D5001C] font-sans"
                    style={{ letterSpacing: "normal" }}
                  >
                    {SUB_CATEGORIES.find((s) => s.id === selectedSubCategory)?.label}
                  </span>
                </>
              )}
              <span
                lang="fa"
                className="text-neutral-400 mr-2 font-sans"
                style={{ letterSpacing: "normal" }}
              >
                ({filteredProducts.length} قطعه)
              </span>
            </div>

            {(selectedGeneration !== "all" || selectedSubCategory !== "all") && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span
                  lang="fa"
                  className="font-sans"
                  style={{ letterSpacing: "normal" }}
                >
                  مشاهده همه قطعات این مدل
                </span>
              </button>
            )}
          </div>
        )}

        {/* Product Grid / Empty State */}
        {selectedModel === "none" ? (
          <div className="py-6 px-4 sm:px-6 text-center border border-dashed border-black/[0.08] dark:border-white/[0.08] max-w-lg mx-auto bg-black/[0.01] dark:bg-white/[0.01]">
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D5001C]" />
              <h3
                lang="fa"
                className="text-xs font-semibold text-neutral-900 dark:text-white font-sans"
                style={{ letterSpacing: "normal" }}
              >
                مدلی انتخاب نشده است
              </h3>
            </div>
            <p
              lang="fa"
              className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-light font-sans leading-normal"
              style={{ letterSpacing: "normal" }}
            >
              جهت مشاهده و سفارش قطعات، پکیج‌های فیس‌لیفت و اکسسوری‌ها، لطفاً یکی از مدل‌های پورشه را از بخش بالا انتخاب نمایید.
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 p-8 max-w-lg mx-auto bg-black/[0.01] dark:bg-white/[0.01]">
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-[#D5001C]" />
            </div>
            <h4
              lang="fa"
              className="text-sm font-semibold text-neutral-900 dark:text-white font-sans mb-1.5"
              style={{ letterSpacing: "normal" }}
            >
              در حال حاضر محصولی در این دسته‌بندی موجود نیست
            </h4>
            <p
              lang="fa"
              className="text-xs font-light font-sans text-neutral-500 dark:text-neutral-400 leading-relaxed mb-5"
              style={{ letterSpacing: "normal" }}
            >
              کاتالوگ قطعات و تجهیزات در حال بارگذاری اقلام جدید می‌باشد و به زودی موجودی جدید اضافه خواهد شد.
            </p>
            {(selectedGeneration !== "all" || selectedSubCategory !== "all") && (
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs cursor-pointer transition-opacity hover:opacity-90"
              >
                <span
                  lang="fa"
                  className="font-sans"
                  style={{ letterSpacing: "normal" }}
                >
                  مشاهده همه قطعات این مدل
                </span>
              </button>
            )}
          </div>
        )}

        {/* Quick View Modal */}
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      </div>
    </section>
  );
}
