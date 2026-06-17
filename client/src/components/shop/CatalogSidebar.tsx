"use client";

import { useState } from "react";
import { brands, categories, processors } from "@/src/lib/DataCatalog";

export type FilterState = {
  category: string;
  brands: string[];
  processors: string[];
  priceMin: number;
  priceMax: number;
};

type CatalogSidebarProps = {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
};

const PRICE_MIN = 499;
const PRICE_MAX = 3999;

export default function CatalogSidebar({ filters, onFilterChange }: CatalogSidebarProps) {
  const [localMax, setLocalMax] = useState(filters.priceMax ?? PRICE_MAX);

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: next });
  };

  const toggleProcessor = (proc: string) => {
    const next = filters.processors.includes(proc)
      ? filters.processors.filter((p) => p !== proc)
      : [...filters.processors, proc];
    onFilterChange({ ...filters, processors: next });
  };

  const setCategory = (cat: string) => {
    onFilterChange({ ...filters, category: filters.category === cat ? "" : cat });
  };

  const clearAll = () => {
    setLocalMax(PRICE_MAX);
    onFilterChange({ category: "", brands: [], processors: [], priceMin: PRICE_MIN, priceMax: PRICE_MAX });
  };

  const applyFilters = () => {
    onFilterChange({ ...filters, priceMax: localMax });
  };

  const hasActiveFilters =
    !!filters.category || filters.brands.length > 0 || filters.processors.length > 0 || localMax < PRICE_MAX;

  // Slider fill percentage
  const fillPct = ((localMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <aside className="hidden lg:flex flex-col w-55 shrink-0 sticky top-20 max-h-[calc(100vh-100px)] bg-surface border border-border rounded-2xl overflow-hidden shadow=card">

      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-display font-bold text-text-primary text-base">Filters</h2>
        <p className="text-xs text-text-muted mt-0.5">Refine your search</p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

        {/* Category */}
        <div className="px-4 py-4 border-b border-border">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-3">
            Category
          </p>
          <div className="flex flex-col gap-0.5">
            {categories.map(({ label, icon }) => {
              const active = filters.category === label;
              return (
                <button
                  key={label}
                  onClick={() => setCategory(label)}
                  className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-150 cursor-pointer ${
                    active
                      ? "bg-accent text-white font-semibold"
                      : "text-text-secondary hover:bg-surface-alt hover:text-text-primary"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[17px]"
                    style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {icon}
                  </span>
                  {label === "Gaming" ? "Gaming Laptops" :
                   label === "Student" ? "Student Essentials" : label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div className="px-4 py-4 border-b border-border">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-3">
            Price Range
          </p>
          {/* Slider */}
          <div className="relative h-1.5 rounded-full bg-surface-alt mb-3">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-accent"
              style={{ width: `${fillPct}%` }}
            />
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={50}
              value={localMax}
              onChange={(e) => setLocalMax(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
              style={{ zIndex: 10 }}
            />
            {/* Thumb visual */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent border-2 border-white shadow-md pointer-events-none"
              style={{ left: `calc(${fillPct}% - 8px)` }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-text-secondary">
            <span>${PRICE_MIN.toLocaleString('en-US')}</span>
            <span>${localMax.toLocaleString('en-US')}</span>
          </div>
        </div>

        {/* Brand */}
        <div className="px-4 py-4 border-b border-border">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-3">
            Brand
          </p>
          <div className="flex flex-wrap gap-1.5">
            {brands.slice(0, 6).map((brand) => {
              const active = filters.brands.includes(brand);
              return (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`text-xs px-3 py-1 rounded-full border font-medium transition-all duration-150 cursor-pointer ${
                    active
                      ? "bg-accent border-accent text-white"
                      : "bg-transparent border-border text-text-secondary hover:border-accent hover:text-accent"
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>

        {/* Processor */}
        <div className="px-4 py-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-3">
            Processor
          </p>
          <div className="flex flex-col gap-2.5">
            {processors.map((proc) => {
              const active = filters.processors.includes(proc);
              return (
                <button
                  key={proc}
                  onClick={() => toggleProcessor(proc)}
                  className="flex items-center gap-2.5 group cursor-pointer text-left"
                >
                  <span
                    className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${
                      active
                        ? "bg-accent border-accent"
                        : "border-border-strong group-hover:border-accent"
                    }`}
                  >
                    {active && (
                      <span className="material-symbols-outlined text-white text-[11px]"></span>
                    )}
                  </span>
                  <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                    {proc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border space-y-2">
        <button
          onClick={applyFilters}
          className="w-full py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-xl transition-colors duration-150 cursor-pointer"
        >
          Apply Filters
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center justify-center gap-1.5 w-full py-1.5 text-text-muted hover:text-accent transition-colors text-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            Clear All
          </button>
        )}
      </div>
    </aside>
  );
}