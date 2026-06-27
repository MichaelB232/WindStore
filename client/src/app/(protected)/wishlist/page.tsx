"use client";

import { useEffect, useState } from "react";
import Container from "@/src/components/layout/Container";
import WishlistCard from "@/src/components/wishlist/WishlistCard";
import { WishlistItem } from "@/src/lib/producttype/ProductType";
import { getWishlist } from "@/src/services/wishlist/wishlist.service";
import { useWishlist } from "@/src/services/wishlist/context/WishlistContext";
import { Heart } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/src/routes/routes";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggle } = useWishlist();

  useEffect(() => {
    getWishlist()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (productId: number) => {
    // Update context (syncs all heart buttons site-wide) + local list
    await toggle(productId);
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  return (
    <main className="py-24 w-full">
      <Container>
        <div className="mb-10">
          <h1 className="font-bold font-display text-4xl">My Wishlist</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading
              ? "Loading…"
              : items.length === 0
                ? "Your wishlist is empty"
                : `${items.length} saved ${items.length === 1 ? "laptop" : "laptops"}`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32 text-muted-foreground">
            Loading wishlist…
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Heart size={48} className="text-muted-foreground mb-4" />
            <h2 className="font-display font-bold text-2xl mb-2">
              Nothing saved yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Hit the heart on any laptop to save it here.
            </p>
            <Link
              href={ROUTES.SHOP}
              className="px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors"
            >
              Browse Laptops
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <WishlistCard key={item.id} item={item} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
