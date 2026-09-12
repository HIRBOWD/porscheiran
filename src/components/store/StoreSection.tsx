"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  VEHICLE_CATEGORIES,
  SUB_CATEGORIES,
  PRODUCTS,
  Product,
  SubCategoryId,
} from "@/data/products";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";
import { soundManager } from "@/lib/audio";
import {
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  Check,
  RotateCcw,
} from "lucide-react";

export default function StoreSection() {
  const [selectedModel, setSelectedModel] = useState<string>("macan");
  const [selectedGeneration, setSelectedGeneration] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryId>("all");
  const [openDropdownModel, setOpenDropdownModel] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const modelRowRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  // Active vehicle model object
  const activeModelObj = useMemo(() => {
    return VEHICLE_CATEGORIES.find((c) => c.id === selectedModel);
  }, [selectedModel]);

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.model === selectedModel);

    if (selectedGeneration !== "all") {
      list = list.filter((p) => p.generation === selectedGeneration);
    }

    if (selectedSubCategory !== "all") {
      list = list.filter((p) => p.category === selectedSubCategory);
    }

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [selectedModel, selectedGeneration, selectedSubCategory, sortBy]);

  const handleModelClick = (modelId: string) => {
    soundManager.playClick();
    if (selectedModel !== modelId) {
      setSelectedModel(modelId);
      setSelectedGeneration("all");
      setSelectedSubCategory("all");
      setOpenDropdownModel(modelId);
    } else {
      // Toggle dropdown for active model
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

  return (
    <section
      id="boutique-store"
      className="relative w-full bg-[#F6F6F8] dark:bg-[#0B0B0D] py-24 md:py-32 px-4 sm:px-6 md:px-12 border-t border-black/[0.06] dark:border-white/[0.08]"
    >
      <div className="max-w-[1720px] mx-auto">
        {/* Section Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-black/[0.06] dark:border-white/[0.08] gap-6">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-400 dark:text-neutral-500 font-mono block mb-3">
              02 / PORSCHE TEQUIPMENT & PERFORMANCE CATALOG
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.1em] text-neutral-950 dark:text-white uppercase">
              THE ACCESSORIES & <span className="font-semibold">PARTS BOUTIQUE</span>
            </h2>
            <p className="mt-3 text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-light max-w-2xl leading-relaxed">
              کاتالوگ تخصصی قطعات یدکی، پکیج‌های فیس‌لیفت و اکسسوری‌های اورجینال پورشه برای مدل‌های Macan، Cayman، Cayenne، Boxster، 911 و Panamera.
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider text-neutral-500 dark:text-neutral-400 border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#121216] px-3.5 py-2 self-start md:self-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
            <span>مرتب‌سازی:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                soundManager.playClick();
                setSortBy(e.target.value as "featured" | "price-asc" | "price-desc");
              }}
              aria-label="Sort products"
              className="bg-transparent text-neutral-900 dark:text-neutral-100 font-medium focus:outline-none cursor-pointer uppercase text-[10px] tracking-[0.15em]"
            >
              <option value="featured" className="bg-white dark:bg-[#121216] text-neutral-900 dark:text-neutral-100">
                پیش‌فرض (Featured)
              </option>
              <option value="price-asc" className="bg-white dark:bg-[#121216] text-neutral-900 dark:text-neutral-100">
                قیمت: کم به زیاد
              </option>
              <option value="price-desc" className="bg-white dark:bg-[#121216] text-neutral-900 dark:text-neutral-100">
                قیمت: زیاد به کم
              </option>
            </select>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* VEHICLE MODEL SELECTOR WITH INDIVIDUAL DROPDOWNS                   */}
        {/* ------------------------------------------------------------------ */}
        <div id="products-catalog-grid" className="mb-6">
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500 block mb-3 font-semibold">
            انتخاب مدل خودرو و دسته‌بندی قطعات (SELECT VEHICLE MODEL & CATEGORY)
          </span>

          <div
            ref={modelRowRef}
            className="flex flex-wrap items-center gap-2.5 sm:gap-3"
          >
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
                    className={`flex items-center gap-2 text-[11px] md:text-xs font-mono tracking-[0.2em] uppercase px-4 py-2.5 transition-all cursor-pointer border ${
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

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      className={`absolute top-full mt-2 z-50 min-w-[240px] sm:min-w-[280px] max-w-[calc(100vw-32px)] bg-white dark:bg-[#121216] border border-black/[0.1] dark:border-white/[0.12] shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-150 ${
                        isRightAligned ? "right-0" : "left-0"
                      }`}
                    >
                      {/* Model Title Header */}
                      <div className="px-3 py-1.5 border-b border-black/[0.06] dark:border-white/[0.08] mb-1 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                          {m.name} Catalog
                        </span>
                        <span className="text-[9px] font-mono text-neutral-400">
                          پورشه
                        </span>
                      </div>

                      {/* All Items for this Model */}
                      <button
                        onClick={() => handleSelectSubOption(m.id, "all", "all")}
                        className={`w-full text-right px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          selectedModel === m.id &&
                          selectedGeneration === "all" &&
                          selectedSubCategory === "all"
                            ? "bg-neutral-100 dark:bg-white/10 text-neutral-950 dark:text-white font-semibold"
                            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5"
                        }`}
                      >
                        <span className="font-mono">همه قطعات و اکسسوری‌های {m.name}</span>
                        {selectedModel === m.id &&
                          selectedGeneration === "all" &&
                          selectedSubCategory === "all" && (
                            <Check className="w-3.5 h-3.5 text-[#D5001C]" />
                          )}
                      </button>

                      {/* Case 1: Model with Generations (Cayenne, Boxster, 911) */}
                      {m.generations && m.generations.length > 0 ? (
                        <div className="mt-1 space-y-2">
                          {m.generations.map((gen) => (
                            <div
                              key={gen.id}
                              className="pt-2 border-t border-black/[0.05] dark:border-white/[0.06]"
                            >
                              <div className="px-3 py-1 flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                  {gen.name}
                                </span>
                                <button
                                  onClick={() =>
                                    handleSelectSubOption(m.id, gen.id, "all")
                                  }
                                  className="text-[10px] font-mono text-neutral-400 hover:text-black dark:hover:text-white underline cursor-pointer"
                                >
                                  همه
                                </button>
                              </div>

                              <div className="space-y-0.5 mt-0.5">
                                {SUB_CATEGORIES.map((sub) => {
                                  const isOptionActive =
                                    selectedModel === m.id &&
                                    selectedGeneration === gen.id &&
                                    selectedSubCategory === sub.id;
                                  return (
                                    <button
                                      key={`${gen.id}-${sub.id}`}
                                      onClick={() =>
                                        handleSelectSubOption(
                                          m.id,
                                          gen.id,
                                          sub.id
                                        )
                                      }
                                      className={`w-full text-right px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                        isOptionActive
                                          ? "bg-neutral-100 dark:bg-white/10 text-[#D5001C] dark:text-[#ff4d4d] font-semibold"
                                          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5"
                                      }`}
                                    >
                                      <span>{sub.label}</span>
                                      {isOptionActive && (
                                        <Check className="w-3.5 h-3.5 text-[#D5001C]" />
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
                        <div className="mt-1 pt-1 border-t border-black/[0.05] dark:border-white/[0.06] space-y-0.5">
                          {SUB_CATEGORIES.map((sub) => {
                            const isOptionActive =
                              selectedModel === m.id &&
                              selectedSubCategory === sub.id;
                            return (
                              <button
                                key={`single-${m.id}-${sub.id}`}
                                onClick={() =>
                                  handleSelectSubOption(m.id, "all", sub.id)
                                }
                                className={`w-full text-right px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                  isOptionActive
                                    ? "bg-neutral-100 dark:bg-white/10 text-[#D5001C] dark:text-[#ff4d4d] font-semibold"
                                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5"
                                }`}
                              >
                                <span>{sub.label}</span>
                                {isOptionActive && (
                                  <Check className="w-3.5 h-3.5 text-[#D5001C]" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Filter State Summary & Reset */}
        <div className="flex items-center justify-between py-3 px-4 mb-8 bg-neutral-100 dark:bg-[#15151a] border border-black/[0.06] dark:border-white/[0.08] text-xs font-mono text-neutral-700 dark:text-neutral-300">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-neutral-400">مدل و دسته‌بندی انتخاب شده:</span>
            <span className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
              {activeModelObj?.name || selectedModel.toUpperCase()}
            </span>
            {selectedGeneration !== "all" && (
              <>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {activeModelObj?.generations?.find((g) => g.id === selectedGeneration)?.name || selectedGeneration}
                </span>
              </>
            )}
            {selectedSubCategory !== "all" && (
              <>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
                <span className="font-semibold text-[#D5001C]">
                  {SUB_CATEGORIES.find((s) => s.id === selectedSubCategory)?.label}
                </span>
              </>
            )}
            <span className="text-neutral-400 mr-2">
              ({filteredProducts.length} قطعه)
            </span>
          </div>

          {(selectedGeneration !== "all" || selectedSubCategory !== "all") && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>مشاهده همه قطعات این مدل</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
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
          <div className="py-20 text-center border border-dashed border-neutral-300 dark:border-neutral-800 p-8">
            <p className="text-sm font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4">
              قطعه‌ای با فیلتر انتخاب شده یافت نشد
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-mono tracking-widest uppercase cursor-pointer"
            >
              مشاهده همه قطعات این مدل
            </button>
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
