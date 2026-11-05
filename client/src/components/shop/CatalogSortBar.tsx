"use client";

import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";

export type ViewMode = "grid" | "list";

type CatalogSortBarProps = {
  total: number;
  sortBy: string;
  viewMode: ViewMode;
  onSortChange: (sort: string) => void;
  onViewChange: (view: ViewMode) => void;
  onToggleMobileFilters?: () => void;
  hasActiveFilters?: boolean;
};

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

export default function CatalogSortBar({
  total,
  sortBy,
  viewMode,
  onSortChange,
  onViewChange,
  onToggleMobileFilters,
  hasActiveFilters = false,
}: CatalogSortBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-page border border-border rounded-xl px-4 py-3 mb-5">
      {/* Count & Mobile Filter button */}
      <div className="flex items-center gap-3">
        {onToggleMobileFilters && (
          <button
            type="button"
            onClick={onToggleMobileFilters}
            className={`lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              hasActiveFilters
                ? "border-accent bg-accent-muted text-accent"
                : "border-border text-text-primary bg-surface hover:bg-surface-alt"
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>
        )}

        <p className="text-xs sm:text-sm text-text-secondary">
          <span className="font-display font-bold text-text-primary">{total}</span>{" "}
          laptops found
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm text-text-secondary hidden xs:inline">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-transparent border-none text-xs sm:text-sm font-semibold text-text-primary focus:ring-0 cursor-pointer pl-0 pr-4 outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-border" />

        {/* View toggle */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onViewChange("grid")}
            aria-label="Grid view"
            className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
              viewMode === "grid"
                ? "text-accent bg-accent-muted"
                : "text-text-muted hover:bg-surface-alt"
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onViewChange("list")}
            aria-label="List view"
            className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
              viewMode === "list"
                ? "text-accent bg-accent-muted"
                : "text-text-muted hover:bg-surface-alt"
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
