"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import CatalogSidebar, { FilterState } from "./CatalogSidebar";
import CatalogHero from "./CatalogHero";
import CatalogSortBar, { ViewMode } from "./CatalogSortBar";
import CatalogCard from "./CatalogCard";
import CatalogListCard from "./CatalogListCard";
import Container from "../layout/Container";
import { CatalogClientProps } from "@/src/lib/producttype/ProductType";

const PRICE_MIN = 0;
const PRICE_MAX = 50_000_000;

function buildFilterUrl(pathname: string, filters: FilterState, sortBy: string) {
  const params = new URLSearchParams();

  if (filters.category) params.set("category", filters.category);
  if (filters.brands.length) params.set("brand", filters.brands.join(","));
  if (filters.processors.length)
    params.set("processor", filters.processors.join(","));
  if (filters.priceMin !== PRICE_MIN)
    params.set("priceMin", String(filters.priceMin));
  if (filters.priceMax !== PRICE_MAX)
    params.set("priceMax", String(filters.priceMax));
  if (sortBy && sortBy !== "featured") params.set("sortBy", sortBy);

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export default function CatalogClient({
  products,
  brands,
  categories,
  processors,
  initialFilters,
}: CatalogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState<FilterState>({
    category: initialFilters?.category ?? "",
    brands: initialFilters?.brand ? initialFilters.brand.split(",") : [],
    processors: initialFilters?.processor
      ? initialFilters.processor.split(",")
      : [],
    priceMin: initialFilters?.priceMin ? Number(initialFilters.priceMin) : PRICE_MIN,
    priceMax: initialFilters?.priceMax ? Number(initialFilters.priceMax) : PRICE_MAX,
  });
  const [sortBy, setSortBy] = useState(initialFilters?.sortBy ?? "featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [visibleCount, setVisibleCount] = useState(8);

  const navigate = (nextFilters: FilterState, nextSort: string) => {
    startTransition(() => {
      router.replace(buildFilterUrl(pathname, nextFilters, nextSort), {
        scroll: false,
      });
    });
  };

  const handleFilterChange = (next: FilterState) => {
    setFilters(next);
    setVisibleCount(8);
    navigate(next, sortBy);
  };

  const handleSortChange = (next: string) => {
    setSortBy(next);
    navigate(filters, next);
  };

  const clearAll = () => {
    const cleared: FilterState = {
      category: "",
      brands: [],
      processors: [],
      priceMin: PRICE_MIN,
      priceMax: PRICE_MAX,
    };
    setFilters(cleared);
    setVisibleCount(8);
    navigate(cleared, sortBy);
  };

  const visible = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <main className="max-w-screen-2xl px-4 md:px-8 pt-24 pb-16 min-h-screen">
      <Container>
        <div className="flex gap-6 shrink-0 items-start">
          <div className="hidden lg:block w-55 self-start sticky top-20">
            <CatalogSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              brands={brands}
              categories={categories}
              processors={processors}
            />
          </div>

          <div className="flex-1 flex flex-col min-w-0 min-h-[80vh]">
            <CatalogHero />

            <CatalogSortBar
              total={products.length}
              sortBy={sortBy}
              viewMode={viewMode}
              onSortChange={handleSortChange}
              onViewChange={setViewMode}
            />

            <div
              className={`flex-1 transition-opacity ${isPending ? "opacity-50" : ""}`}
            >
              {visible.length === 0 ? (
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
                    onClick={clearAll}
                    className="px-6 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-hover transition-colors cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {visible.map((p) => (
                    <CatalogCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3 w-full">
                  {visible.map((p) => (
                    <CatalogListCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setVisibleCount((c) => c + 8)}
                  className="px-8 py-3 bg-surface border border-border text-text-secondary font-semibold text-sm rounded-xl hover:bg-accent-muted hover:border-accent hover:text-accent transition-all duration-150 shadow-card cursor-pointer"
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