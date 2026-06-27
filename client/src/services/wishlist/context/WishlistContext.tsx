"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../wishlist.service";

interface WishlistContextType {
  wishlistIds: Set<number>;
  isWishlisted: (productId: number) => boolean;
  toggle: (productId: number) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function sync() {
      if (!user) {
        // defer so we're not calling setState synchronously in the effect body
        await Promise.resolve();
        if (!cancelled) setWishlistIds(new Set());
        return;
      }

      setLoading(true);
      try {
        const items = await getWishlist();
        if (!cancelled) {
          setWishlistIds(new Set(items.map((item) => item.productId)));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    sync();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const isWishlisted = (productId: number) => wishlistIds.has(productId);

  const toggle = async (productId: number) => {
    if (!user) return;

    const alreadyIn = wishlistIds.has(productId);

    // Optimistic update
    setWishlistIds((prev) => {
      const next = new Set(prev);
      alreadyIn ? next.delete(productId) : next.add(productId);
      return next;
    });

    const res = alreadyIn
      ? await removeFromWishlist(productId)
      : await addToWishlist(productId);

    // Revert on failure
    if (!res.success) {
      setWishlistIds((prev) => {
        const next = new Set(prev);
        alreadyIn ? next.add(productId) : next.delete(productId);
        return next;
      });
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistIds, isWishlisted, toggle, loading }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
