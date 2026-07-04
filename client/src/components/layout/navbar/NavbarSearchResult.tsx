"use client";

import Image from "next/image";
import { Loader2, PackageSearch, SearchX, WifiOff } from "lucide-react";
import { SearchResult } from "@/src/lib/producttype/ProductType";
import { formatPrice } from "@/src/utils/utils";

type SearchState = "idle" | "loading" | "error" | "done";

type NavbarSearchResultsProps = {
  query: string;
  results: SearchResult[];
  state: SearchState;
  activeIndex: number;
  onSelect: (slug: string) => void;
  onHoverIndex: (index: number) => void;
};

export default function NavbarSearchResults({
  query,
  results,
  state,
  activeIndex,
  onSelect,
  onHoverIndex,
}: NavbarSearchResultsProps) {
  return (
    <div
      className="absolute top-[calc(100%+10px)] left-0 w-104 max-w-[calc(100vw-2rem)]
        bg-white border border-border rounded-2xl shadow-card-hover overflow-hidden z-50
        animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150"
    >
      {/* Loading */}
      {state === "loading" && (
        <div className="flex items-center justify-center gap-2.5 py-10 text-text-secondary">
          <Loader2 size={17} className="animate-spin text-accent" />
          <span className="text-sm">Searching…</span>
        </div>
      )}

      {/* Error */}
      {state === "error" && (
        <div className="flex flex-col items-center justify-center gap-2 py-10 px-6 text-center">
          <WifiOff size={22} className="text-danger" />
          <p className="text-sm font-semibold text-text-primary">
            Couldn&apos;t load results
          </p>
          <p className="text-xs text-text-secondary">
            Something went wrong while searching. Please try again.
          </p>
        </div>
      )}

      {/* Empty / not found */}
      {state === "done" && results.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-10 px-6 text-center">
          <SearchX size={22} className="text-text-muted" />
          <p className="text-sm font-semibold text-text-primary">
            No products found
          </p>
          <p className="text-xs text-text-secondary">
            We couldn&apos;t find anything for &quot;{query}&quot;. Try a
            different brand or model.
          </p>
        </div>
      )}

      {/* Results */}
      {state === "done" && results.length > 0 && (
        <ul
          id="navbar-search-listbox"
          role="listbox"
          className="max-h-104 overflow-y-auto py-2"
        >
          {results.map((product, index) => (
            <li
              key={product.id}
              role="option"
              aria-selected={index === activeIndex}
            >
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect(product.slug)}
                onMouseEnter={() => onHoverIndex(index)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors duration-100 cursor-pointer
                  ${index === activeIndex ? "bg-accent-muted" : "hover:bg-surface-alt"}
                `}
              >
                <div className="relative shrink-0 w-14 h-14 rounded-xl bg-surface-alt flex items-center justify-center p-1.5 overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={`${product.brand?.name ?? ""} ${product.name}`}
                      width={56}
                      height={56}
                      className="w-full h-full object-contain mix-blend-multiply"
                      unoptimized
                    />
                  ) : (
                    <PackageSearch size={20} className="text-text-muted" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[9px] text-accent uppercase tracking-widest font-semibold truncate">
                    {product.brand?.name ?? "Unknown brand"}
                  </p>
                  <p className="font-display font-bold text-sm text-text-primary leading-snug truncate">
                    {product.name}
                  </p>
                  {product.category?.name && (
                    <p className="text-[11px] text-text-secondary truncate">
                      {product.category.name}
                    </p>
                  )}
                </div>

                <p className="shrink-0 font-display font-bold text-sm text-text-primary">
                  {formatPrice(product.basePrice)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
