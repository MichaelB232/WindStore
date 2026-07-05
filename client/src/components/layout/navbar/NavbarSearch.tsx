"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import NavbarSearchResults from "./NavbarSearchResult";
import { ROUTES } from "@/src/routes/routes";
import { useDebounce } from "@/src/hooks/useDebounce";
import { getProductBySearch } from "@/src/services/products/product.service";
import { SearchResult } from "@/src/lib/producttype/ProductType";

const MIN_QUERY_LENGTH = 2;

type Settled = {
  query: string;
  results: SearchResult[];
  error: boolean;
};

export default function NavbarSearch({
  isTransparent,
}: {
  isTransparent: boolean;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [settled, setSettled] = useState<Settled | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);
  const trimmedQuery = debouncedQuery.trim();

  const isQueryTooShort = trimmedQuery.length < MIN_QUERY_LENGTH;
  const isLoading = !isQueryTooShort && settled?.query !== trimmedQuery;
  const results = settled?.query === trimmedQuery ? settled.results : [];
  const hasError =
    !isQueryTooShort && settled?.query === trimmedQuery && settled.error;
  const searchState: "idle" | "loading" | "error" | "done" = isQueryTooShort
    ? "idle"
    : isLoading
      ? "loading"
      : hasError
        ? "error"
        : "done";
  const isOpen = isFocused && !isQueryTooShort;

  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isQueryTooShort) return;

    let cancelled = false;
    const controller = new AbortController();

    getProductBySearch(trimmedQuery, controller.signal)
      .then((products) => {
        if (cancelled) return;
        setSettled({ query: trimmedQuery, results: products, error: false });
      })
      .catch((err) => {
        if (cancelled || (err as Error)?.name === "AbortError") return;
        setSettled({ query: trimmedQuery, results: [], error: true });
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [trimmedQuery, isQueryTooShort]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (!searchWrapperRef.current?.contains(e.target as Node)) {
        inputRef.current?.blur();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        inputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectResult = (slug: string) => {
    inputRef.current?.blur();
    setSearchQuery("");
    router.push(`${ROUTES.LAPTOP}/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || searchState !== "done" || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelectResult(results[activeIndex].slug);
    }
  };

  return (
    <div ref={searchWrapperRef} className="relative">
      <div
        className={`group searchBar flex items-center gap-2 rounded-xl border px-3 h-10 w-64
          transition-all duration-300
          focus-within:shadow-focus
          ${
            isTransparent
              ? // Border dan teks putih saat transparan
                "border-white/40 focus-within:border-white"
              : // Border gelap saat solid
                "border-text-muted focus-within:border-accent-hover"
          }
        `}
      >
        <Search
          size={18}
          className={`shrink-0 transition-colors duration-300
            ${
              isTransparent
                ? "text-white/70 group-focus-within:text-white"
                : "text-text-secondary group-focus-within:text-accent-hover"
            }
          `}
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="navbar-search-listbox"
          aria-autocomplete="list"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Cari laptop, brand..."
          className={`flex-1 min-w-0 bg-transparent outline-none border-none focus:ring-0 transition-colors duration-300
            ${
              isTransparent
                ? "placeholder:text-white/50 text-white"
                : "placeholder:text-text-muted text-text-primary"
            }
          `}
        />
      </div>

      {isOpen && (
        <NavbarSearchResults
          query={trimmedQuery}
          results={results}
          state={searchState}
          activeIndex={activeIndex}
          onSelect={handleSelectResult}
          onHoverIndex={setActiveIndex}
        />
      )}
    </div>
  );
}
