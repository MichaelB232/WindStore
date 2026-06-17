"use client";

import { useState, useMemo } from "react";
import { catalogProducts } from "@/src/lib/DataCatalog";
import CatalogSidebar, { FilterState } from "./CatalogSidebar";
import CatalogHero from "./CatalogHero";
import CatalogSortBar, { ViewMode } from "./CatalogSortBar";
import CatalogCard from "../ui/CatalogCard";
import CatalogListCard from "../ui/CatalogListCard";
import Container from "../layout/Container";

const PRICE_MIN = 499;
const PRICE_MAX = 3999;

export default function CatalogClient() {
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    brands: [],
    processors: [],
    priceMin: PRICE_MIN,
    priceMax: PRICE_MAX,
  });
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => {
    return catalogProducts.filter((p) => {
      if (filters.category && p.category !== filters.category) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand))
        return false;
      if (filters.processors.length > 0) {
        const match = filters.processors.some((proc) =>
          p.specs.some((spec) =>
            spec.toLowerCase().includes(proc.toLowerCase()),
          ),
        );
        if (!match) return false;
      }
      const price = parseFloat(p.price.replace(/[$,]/g, ""));
      if (price < filters.priceMin || price > filters.priceMax) return false;
      return true;
    });
  }, [filters]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const pa = parseFloat(a.price.replace(/[$,]/g, ""));
      const pb = parseFloat(b.price.replace(/[$,]/g, ""));
      if (sortBy === "price-asc") return pa - pb;
      if (sortBy === "price-desc") return pb - pa;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [filtered, sortBy]);

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  return (
    <main className="max-w-screen-2xl px-4 md:px-8 pt-24 pb-16 min-h-screen">
      <Container>
        <div className="flex gap-6 shrink-0 items-start">
          {/* SIDEBAR */}
          <div className="hidden lg:block w-55  self-start sticky top-20">
            <CatalogSidebar filters={filters} onFilterChange={setFilters} />
          </div>

          {/* MAIN COLUMN */}
          <div className="flex-1 flex flex-col min-w-0 min-h-[80vh]">
            {/* Hero */}
            <CatalogHero />

            {/* Sort bar */}
            <CatalogSortBar
              total={sorted.length}
              sortBy={sortBy}
              viewMode={viewMode}
              onSortChange={setSortBy}
              onViewChange={setViewMode}
            />

            {/* PRODUCT AREA  */}
            <div className="flex-1">
              {visible.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <span className="material-symbols-outlined text-5xl text-text-muted mb-3">
                    search_off
                  </span>
                  <h3 className="font-display font-bold text-lg text-text-primary mb-1">
                    No laptops found
                  </h3>
                  <p className="text-sm text-text-secondary mb-5">
                    Try adjusting your filters to see more results.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        category: "",
                        brands: [],
                        processors: [],
                        priceMin: PRICE_MIN,
                        priceMax: PRICE_MAX,
                      })
                    }
                    className="px-6 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-hover transition-colors cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                /* Grid view */
                <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {visible.map((p) => (
                    <CatalogCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                /* List view */
                <div className="flex flex-col gap-3 w-full">
                  {visible.map((p) => (
                    <CatalogListCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setVisibleCount((c) => c + 8)}
                  className="px-8 py-3 bg-surface border border-border text-text-secondary font-semibold text-sm rounded-xl hover:bg-accent-muted] hover:border-accent hover:text-accent transition-all duration-150 shadow-card cursor-pointer"
                >
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
