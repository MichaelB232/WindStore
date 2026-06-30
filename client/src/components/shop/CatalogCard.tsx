"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { Product } from "@/src/lib/producttype/ProductType";
import { ROUTES } from "@/src/routes/routes";
import { formatPrice } from "@/src/utils/utils";
import { addToCart } from "@/src/services/cart/cart.service";
import { useWishlist } from "@/src/services/wishlist/context/WishlistContext";
import { useAuth } from "@/src/hooks/useAuth";

const badgeClasses: Record<string, string> = {
  New: "bg-accent text-white",
  Premium: "bg-warning text-white",
  "Best Seller": "bg-danger text-white",
};

export default function CatalogCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const [cartState, setCartState] = useState<"idle" | "loading" | "added">(
    "idle",
  );
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock <= 0;

  const specChips = [
    product.specs.processor,
    product.specs.gpu,
    product.specs.ram,
  ];
  const productHref = `${ROUTES.LAPTOP}/${product.slug}`;

  const handleQuickAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    if (cartState !== "idle" || !product.defaultConfig || outOfStock) return;
    setCartState("loading");
    const result = await addToCart(product.id, product.defaultConfig.id);
    if (result.success) {
      setCartState("added");
      setTimeout(() => setCartState("idle"), 2000);
    } else {
      setCartState("idle");
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to save items to your wishlist");
      return;
    }

    toggle(product.id);
  };

  return (
    <div className="group relative h-full">
      {/* Heart button */}
      <button
        onClick={handleWishlist}
        title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
        className={`absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full transition-all duration-150 cursor-pointer shadow-sm
          ${wishlisted ? "text-danger" : "text-text-muted hover:text-danger hover:bg-white"}`}
      >
        <Heart size={13} className={wishlisted ? "fill-current" : ""} />
      </button>

      {/* Card */}
      <Link
        href={productHref}
        className="h-full bg-surface border border-border rounded-2xl overflow-hidden flex flex-col shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover hover:border-border-strong"
      >
        <div
          className="relative bg-surface-alt flex items-center justify-center p-4 overflow-hidden shrink-0"
          style={{ height: "170px" }}
        >
          {outOfStock ? (
            <span className="absolute top-3 left-3 z-10 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-text-primary text-white">
              Out of Stock
            </span>
          ) : (
            product.badge && (
              <span
                className={`absolute top-3 left-3 z-10 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badgeClasses[product.badge] ?? "bg-surface-alt text-text-secondary"}`}
              >
                {product.badge}
              </span>
            )
          )}
          <Image
            src={product.imageUrl}
            alt={`${product.brand.name} ${product.name}`}
            width={280}
            height={160}
            className={`w-full h-full object-contain drop-shadow-md mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.04] ${outOfStock ? "grayscale opacity-50" : ""}`}
            unoptimized
          />
        </div>

        <div className="p-4 flex flex-col flex-1 min-h-0">
          <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-1 font-semibold">
            {product.brand.name}
          </p>
          <h3 className="font-display font-bold text-[15px] leading-snug text-text-primary mb-2 line-clamp-2 min-h-[2.4em]">
            {product.name}
          </h3>
          <div className="flex flex-wrap gap-1 mb-3 min-h-5.5">
            {specChips.map((spec) => (
              <span
                key={spec}
                className="font-mono text-[10px] bg-surface-alt text-text-secondary px-2 py-0.5 rounded"
              >
                {spec}
              </span>
            ))}
          </div>
          <div className="mt-auto pt-3 border-t border-border">
            <div className="mb-2.5">
              <p className="font-display font-bold text-xl leading-none">
                {formatPrice(product.basePrice)}
              </p>
            </div>
            <div className="flex gap-2">
              <span className="flex-1 min-w-0">
                <span className="w-full block text-center py-2 bg-accent group-hover:bg-accent-hover text-white font-semibold text-xs rounded-xl transition-colors duration-150">
                  {outOfStock ? "View Details" : "Customize Build"}
                </span>
              </span>
              <button
                type="button"
                title={
                  outOfStock
                    ? "Out of stock"
                    : cartState === "added"
                      ? "Added to cart"
                      : "Quick add to cart"
                }
                onClick={handleQuickAddToCart}
                disabled={cartState !== "idle" || outOfStock}
                className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-xl border transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                  ${cartState === "added" ? "bg-green-500 border-green-500 text-white" : "border-border text-accent hover:bg-accent-muted hover:border-accent"}`}
              >
                {cartState === "added" ? (
                  <Check size={13} />
                ) : (
                  <ShoppingCart
                    size={13}
                    className={cartState === "loading" ? "animate-pulse" : ""}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
