"use client";

import React, { useState, useMemo } from "react";
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
import { SlidersHorizontal, ChevronRight, Layers, RotateCcw } from "lucide-react";

export default function StoreSection() {
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [selectedGeneration, setSelectedGeneration] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryId>("all");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [showDirectory, setShowDirectory] = useState(true);

  // Active vehicle model object
  const activeModelObj = useMemo(() => {
    return VEHICLE_CATEGORIES.find((c) => c.id === selectedModel);
  }, [selectedModel]);

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;

    if (selectedModel !== "all") {
      list = list.filter((p) => p.model === selectedModel);
    }

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

  const handleSelectModel = (modelId: string) => {
    soundManager.playClick();
    setSelectedModel(modelId);
    setSelectedGeneration("all");
  };

  const handleSelectQuickCategory = (
    modelId: string,
    genId: string = "all",
    subCat: SubCategoryId = "all"
  ) => {
    soundManager.playClick();
    setSelectedModel(modelId);
    setSelectedGeneration(genId);
    setSelectedSubCategory(subCat);

    // Scroll to products grid
    const target = document.getElementById("products-catalog-grid");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleResetFilters = () => {
    soundManager.playClick();
    setSelectedModel("all");
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

          {/* Directory Toggle & Sort */}
          <div className="flex items-center flex-wrap gap-4">
            <button
              onClick={() => setShowDirectory(!showDirectory)}
              className="flex items-center gap-2 px-3.5 py-2 text-[10px] font-mono tracking-widest uppercase border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#121216] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showDirectory ? "پنهان کردن فهرست مدل‌ها" : "نمایش فهرست کامل مدل‌ها"}</span>
            </button>

            <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider text-neutral-500 dark:text-neutral-400 border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#121216] px-3.5 py-2">
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
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* COMPREHENSIVE VEHICLE MODEL CATEGORY DIRECTORY LIST                */}
        {/* ------------------------------------------------------------------ */}
        {showDirectory && (
          <div className="mb-14 p-6 sm:p-8 bg-white dark:bg-[#121216] border border-black/[0.08] dark:border-white/[0.1] shadow-xs animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D5001C]" />
                <h3 className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-neutral-900 dark:text-white font-mono">
                  فهرست دسته‌بندی مدل‌های پورشه (PORSCHE CATEGORY LIST)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest hidden sm:inline">
                انتخاب مدل و دسته‌بندی جهت مشاهده قطعات
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* 1. Macan */}
              <div className="p-4 rounded-none bg-[#F9F9FB] dark:bg-[#18181D] border border-black/[0.04] dark:border-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-900 dark:text-white font-mono">
                    Macan
                  </span>
                  <button
                    onClick={() => handleSelectQuickCategory("macan")}
                    className="text-[10px] font-mono text-neutral-400 hover:text-black dark:hover:text-white underline cursor-pointer"
                  >
                    مشاهده همه
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUB_CATEGORIES.map((sub) => {
                    const isSelected =
                      selectedModel === "macan" && selectedSubCategory === sub.id;
                    return (
                      <button
                        key={`macan-${sub.id}`}
                        onClick={() => handleSelectQuickCategory("macan", "all", sub.id)}
                        className={`text-[11px] px-3 py-1.5 transition-colors cursor-pointer border ${
                          isSelected
                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white font-medium"
                            : "bg-white dark:bg-[#202026] text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.08] hover:border-neutral-500"
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Cayman */}
              <div className="p-4 rounded-none bg-[#F9F9FB] dark:bg-[#18181D] border border-black/[0.04] dark:border-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-900 dark:text-white font-mono">
                    Cayman
                  </span>
                  <button
                    onClick={() => handleSelectQuickCategory("cayman")}
                    className="text-[10px] font-mono text-neutral-400 hover:text-black dark:hover:text-white underline cursor-pointer"
                  >
                    مشاهده همه
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUB_CATEGORIES.map((sub) => {
                    const isSelected =
                      selectedModel === "cayman" && selectedSubCategory === sub.id;
                    return (
                      <button
                        key={`cayman-${sub.id}`}
                        onClick={() => handleSelectQuickCategory("cayman", "all", sub.id)}
                        className={`text-[11px] px-3 py-1.5 transition-colors cursor-pointer border ${
                          isSelected
                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white font-medium"
                            : "bg-white dark:bg-[#202026] text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.08] hover:border-neutral-500"
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Cayenne */}
              <div className="p-4 rounded-none bg-[#F9F9FB] dark:bg-[#18181D] border border-black/[0.04] dark:border-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-900 dark:text-white font-mono">
                    Cayenne
                  </span>
                  <button
                    onClick={() => handleSelectQuickCategory("cayenne")}
                    className="text-[10px] font-mono text-neutral-400 hover:text-black dark:hover:text-white underline cursor-pointer"
                  >
                    مشاهده همه
                  </button>
                </div>

                {/* Sublist: Cayenne 2008-2010 */}
                <div className="mt-2.5 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                    Cayenne 2008–2010:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUB_CATEGORIES.map((sub) => {
                      const isSelected =
                        selectedModel === "cayenne" &&
                        selectedGeneration === "cayenne-2008-2010" &&
                        selectedSubCategory === sub.id;
                      return (
                        <button
                          key={`cayenne-08-10-${sub.id}`}
                          onClick={() =>
                            handleSelectQuickCategory("cayenne", "cayenne-2008-2010", sub.id)
                          }
                          className={`text-[10px] px-2.5 py-1 transition-colors cursor-pointer border ${
                            isSelected
                              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white font-medium"
                              : "bg-white dark:bg-[#202026] text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.08] hover:border-neutral-500"
                          }`}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sublist: Cayenne 2011-2014 */}
                <div className="mt-2.5 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                    Cayenne 2011–2014:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUB_CATEGORIES.map((sub) => {
                      const isSelected =
                        selectedModel === "cayenne" &&
                        selectedGeneration === "cayenne-2011-2014" &&
                        selectedSubCategory === sub.id;
                      return (
                        <button
                          key={`cayenne-11-14-${sub.id}`}
                          onClick={() =>
                            handleSelectQuickCategory("cayenne", "cayenne-2011-2014", sub.id)
                          }
                          className={`text-[10px] px-2.5 py-1 transition-colors cursor-pointer border ${
                            isSelected
                              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white font-medium"
                              : "bg-white dark:bg-[#202026] text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.08] hover:border-neutral-500"
                          }`}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. Boxster */}
              <div className="p-4 rounded-none bg-[#F9F9FB] dark:bg-[#18181D] border border-black/[0.04] dark:border-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-900 dark:text-white font-mono">
                    Boxster
                  </span>
                  <button
                    onClick={() => handleSelectQuickCategory("boxster")}
                    className="text-[10px] font-mono text-neutral-400 hover:text-black dark:hover:text-white underline cursor-pointer"
                  >
                    مشاهده همه
                  </button>
                </div>

                {/* Sublist: Boxster 2010-2012 */}
                <div className="mt-2.5 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                    Boxster 2010–2012:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUB_CATEGORIES.map((sub) => {
                      const isSelected =
                        selectedModel === "boxster" &&
                        selectedGeneration === "boxster-2010-2012" &&
                        selectedSubCategory === sub.id;
                      return (
                        <button
                          key={`boxster-10-12-${sub.id}`}
                          onClick={() =>
                            handleSelectQuickCategory("boxster", "boxster-2010-2012", sub.id)
                          }
                          className={`text-[10px] px-2.5 py-1 transition-colors cursor-pointer border ${
                            isSelected
                              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white font-medium"
                              : "bg-white dark:bg-[#202026] text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.08] hover:border-neutral-500"
                          }`}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sublist: Boxster 2017-2018 */}
                <div className="mt-2.5 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                    Boxster (718) 2017–2018:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUB_CATEGORIES.map((sub) => {
                      const isSelected =
                        selectedModel === "boxster" &&
                        selectedGeneration === "boxster-2017-2018" &&
                        selectedSubCategory === sub.id;
                      return (
                        <button
                          key={`boxster-17-18-${sub.id}`}
                          onClick={() =>
                            handleSelectQuickCategory("boxster", "boxster-2017-2018", sub.id)
                          }
                          className={`text-[10px] px-2.5 py-1 transition-colors cursor-pointer border ${
                            isSelected
                              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white font-medium"
                              : "bg-white dark:bg-[#202026] text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.08] hover:border-neutral-500"
                          }`}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 5. 911 */}
              <div className="p-4 rounded-none bg-[#F9F9FB] dark:bg-[#18181D] border border-black/[0.04] dark:border-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-900 dark:text-white font-mono">
                    911
                  </span>
                  <button
                    onClick={() => handleSelectQuickCategory("911")}
                    className="text-[10px] font-mono text-neutral-400 hover:text-black dark:hover:text-white underline cursor-pointer"
                  >
                    مشاهده همه
                  </button>
                </div>

                {/* Sublist: Carrera 4 */}
                <div className="mt-2.5 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                    Carrera 4:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUB_CATEGORIES.map((sub) => {
                      const isSelected =
                        selectedModel === "911" &&
                        selectedGeneration === "911-carrera-4" &&
                        selectedSubCategory === sub.id;
                      return (
                        <button
                          key={`911-carrera4-${sub.id}`}
                          onClick={() =>
                            handleSelectQuickCategory("911", "911-carrera-4", sub.id)
                          }
                          className={`text-[10px] px-2.5 py-1 transition-colors cursor-pointer border ${
                            isSelected
                              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white font-medium"
                              : "bg-white dark:bg-[#202026] text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.08] hover:border-neutral-500"
                          }`}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sublist: Carrera S 2011-2014 */}
                <div className="mt-2.5 pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                    Carrera S 2011–2014:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUB_CATEGORIES.map((sub) => {
                      const isSelected =
                        selectedModel === "911" &&
                        selectedGeneration === "911-carrera-s-2011-2014" &&
                        selectedSubCategory === sub.id;
                      return (
                        <button
                          key={`911-carrera-s-${sub.id}`}
                          onClick={() =>
                            handleSelectQuickCategory("911", "911-carrera-s-2011-2014", sub.id)
                          }
                          className={`text-[10px] px-2.5 py-1 transition-colors cursor-pointer border ${
                            isSelected
                              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white font-medium"
                              : "bg-white dark:bg-[#202026] text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.08] hover:border-neutral-500"
                          }`}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 6. Panamera */}
              <div className="p-4 rounded-none bg-[#F9F9FB] dark:bg-[#18181D] border border-black/[0.04] dark:border-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold tracking-[0.2em] uppercase text-neutral-900 dark:text-white font-mono">
                    Panamera
                  </span>
                  <button
                    onClick={() => handleSelectQuickCategory("panamera")}
                    className="text-[10px] font-mono text-neutral-400 hover:text-black dark:hover:text-white underline cursor-pointer"
                  >
                    مشاهده همه
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUB_CATEGORIES.map((sub) => {
                    const isSelected =
                      selectedModel === "panamera" && selectedSubCategory === sub.id;
                    return (
                      <button
                        key={`panamera-${sub.id}`}
                        onClick={() => handleSelectQuickCategory("panamera", "all", sub.id)}
                        className={`text-[11px] px-3 py-1.5 transition-colors cursor-pointer border ${
                          isSelected
                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white font-medium"
                            : "bg-white dark:bg-[#202026] text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.08] hover:border-neutral-500"
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* INTERACTIVE DYNAMIC FILTER BARS                                    */}
        {/* ------------------------------------------------------------------ */}
        <div id="products-catalog-grid" className="space-y-4 mb-10">
          {/* 1. Model Selector Row */}
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500 block mb-2 font-semibold">
              انتخاب مدل خودرو (SELECT VEHICLE MODEL)
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => handleSelectModel("all")}
                className={`text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase px-4 py-2.5 transition-all whitespace-nowrap cursor-pointer border ${
                  selectedModel === "all"
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white shadow-xs"
                    : "bg-white dark:bg-[#141418] text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.2]"
                }`}
              >
                همه مدل‌ها • All Models
              </button>
              {VEHICLE_CATEGORIES.map((m) => {
                const isActive = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelectModel(m.id)}
                    className={`text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase px-4 py-2.5 transition-all whitespace-nowrap cursor-pointer border ${
                      isActive
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white shadow-xs"
                        : "bg-white dark:bg-[#141418] text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.2]"
                    }`}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Generation Selector Row (Only when model has generations: Cayenne, Boxster, 911) */}
          {activeModelObj?.generations && activeModelObj.generations.length > 0 && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500 block mb-2 font-semibold">
                نسل و تیپ {activeModelObj.name} (GENERATION & VARIANT)
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedGeneration("all");
                  }}
                  className={`text-[10px] font-mono tracking-wider uppercase px-3.5 py-2 transition-all whitespace-nowrap cursor-pointer border ${
                    selectedGeneration === "all"
                      ? "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-950 border-neutral-800 dark:border-neutral-200"
                      : "bg-white/80 dark:bg-[#18181D] text-neutral-600 dark:text-neutral-400 border-black/[0.06] dark:border-white/[0.08] hover:border-neutral-400"
                  }`}
                >
                  همه نسل‌ها • All Years
                </button>
                {activeModelObj.generations.map((gen) => {
                  const isGenActive = selectedGeneration === gen.id;
                  return (
                    <button
                      key={gen.id}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedGeneration(gen.id);
                      }}
                      className={`text-[10px] font-mono tracking-wider uppercase px-3.5 py-2 transition-all whitespace-nowrap cursor-pointer border ${
                        isGenActive
                          ? "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-950 border-neutral-800 dark:border-neutral-200"
                          : "bg-white/80 dark:bg-[#18181D] text-neutral-600 dark:text-neutral-400 border-black/[0.06] dark:border-white/[0.08] hover:border-neutral-400"
                      }`}
                    >
                      {gen.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. SubCategory List Tabs (اکسسوری - فیس لیفت - لوازم یدکی و مصرفی) */}
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-500 block mb-2 font-semibold">
              دسته‌بندی قطعات و خدمات (CATEGORIES)
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setSelectedSubCategory("all");
                }}
                className={`text-[11px] font-medium tracking-wide px-4 py-2 transition-all whitespace-nowrap cursor-pointer border ${
                  selectedSubCategory === "all"
                    ? "bg-[#D5001C] text-white border-[#D5001C] shadow-xs"
                    : "bg-white dark:bg-[#141418] text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.2]"
                }`}
              >
                همه قطعات (All)
              </button>
              {SUB_CATEGORIES.map((sub) => {
                const isSubActive = selectedSubCategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedSubCategory(sub.id);
                    }}
                    className={`text-[11px] font-medium tracking-wide px-4 py-2 transition-all whitespace-nowrap cursor-pointer border ${
                      isSubActive
                        ? "bg-[#D5001C] text-white border-[#D5001C] shadow-xs"
                        : "bg-white dark:bg-[#141418] text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.08] hover:border-black/[0.2]"
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Filter State Summary & Reset */}
        {(selectedModel !== "all" ||
          selectedGeneration !== "all" ||
          selectedSubCategory !== "all") && (
          <div className="flex items-center justify-between py-3 px-4 mb-8 bg-neutral-100 dark:bg-[#15151a] border border-black/[0.06] dark:border-white/[0.08] text-xs font-mono text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-neutral-400">فیلتر فعال:</span>
              <span className="font-semibold text-neutral-900 dark:text-white uppercase">
                {selectedModel !== "all" ? selectedModel.toUpperCase() : "همه مدل‌ها"}
              </span>
              {selectedGeneration !== "all" && (
                <>
                  <ChevronRight className="w-3 h-3 text-neutral-400" />
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {selectedGeneration}
                  </span>
                </>
              )}
              {selectedSubCategory !== "all" && (
                <>
                  <ChevronRight className="w-3 h-3 text-neutral-400" />
                  <span className="font-semibold text-[#D5001C]">
                    {
                      SUB_CATEGORIES.find((s) => s.id === selectedSubCategory)?.label
                    }
                  </span>
                </>
              )}
              <span className="text-neutral-400 mr-2">
                ({filteredProducts.length} قطعه یافت شد)
              </span>
            </div>

            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>پاک کردن فیلترها</span>
            </button>
          </div>
        )}

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
              مشاهده همه قطعات و اکسسوری‌ها
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
