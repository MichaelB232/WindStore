"use client";

import { LayoutGrid, List } from "lucide-react";

export type ViewMode = "grid" | "list";

type CatalogSortBarProps = {
  total: number;
  sortBy: string;
  viewMode: ViewMode;
  onSortChange: (sort: string) => void;
  onViewChange: (view: ViewMode) => void;
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
}: CatalogSortBarProps) {
  return (
    <div className="flex justify-between items-center bg-page border border-border rounded-xl px-4 py-3 mb-5 shadow-">
      {/* Count */}
      <p className="text-sm text-text-secondary">
        <span className="font-display font-bold text-text-primary">{total}</span>{" "}
        laptops found
      </p>

      <div className="flex items-center gap-3">
        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-text-secondary">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-transparent border-none text-sm font-semibold text-text-primary focus:ring-0 cursor-pointer pl-0 pr-5 outline-none"
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
            className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
              viewMode === "grid"
                ? "text-accent bg-accent-muted"
                : "text-text-muted hover:bg-surface-alt"
            }`}
          >
            <LayoutGrid size={17} />
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={`p-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
              viewMode === "list"
                ? "text-accent bg-accent-muted"
                : "text-text-muted hover:bg-surface-alt"
            }`}
          >
            <List size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}