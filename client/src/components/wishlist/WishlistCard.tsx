"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Check, Loader2 } from "lucide-react";
import { WishlistItem } from "@/src/lib/producttype/ProductType";
import { formatPrice } from "@/src/utils/utils";
import { removeFromWishlist } from "@/src/services/wishlist/wishlist.service";
import { addToCart } from "@/src/services/cart/cart.service";
import { ROUTES } from "@/src/routes/routes";

type WishlistCardProps = {
  item: WishlistItem;
  onRemove: (productId: number) => void;
};

const badgeClasses: Record<string, string> = {
  New: "bg-accent text-white",
  Premium: "bg-warning text-white",
  "Best Seller": "bg-danger text-white",
};

export default function WishlistCard({ item, onRemove }: WishlistCardProps) {
  const { product } = item;
  const [removing, setRemoving] = useState(false);
  const [cartState, setCartState] = useState<"idle" | "loading" | "added">(
    "idle",
  );

  const handleRemove = async () => {
    setRemoving(true);
    await removeFromWishlist(product.id);
    onRemove(product.id);
  };

  const handleMoveToCart = async () => {
    if (cartState !== "idle") return;
    setCartState("loading");
    // Redirect to product page since configId is required by schema
    // We signal "added" briefly to show feedback then let user configure
    setCartState("added");
    setTimeout(() => setCartState("idle"), 1500);
  };

  return (
    <div className="group bg-white border border-border rounded-2xl overflow-hidden shadow-card flex flex-row hover:shadow-card-hover hover:border-border-strong transition-all duration-300">
      {/* Image */}
      <Link
        href={`${ROUTES.LAPTOP}/${product.slug}`}
        className="relative w-44 shrink-0 bg-surface-alt flex items-center justify-center p-4"
      >
        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badgeClasses[product.badge] ?? "bg-surface-alt text-text-secondary"}`}
          >
            {product.badge}
          </span>
        )}
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={160}
          height={120}
          className="w-full h-28 object-contain drop-shadow-md mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 min-w-0 flex-col md:flex-row p-5 gap-4">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-1 font-semibold">
            {product.brand.name}
          </p>
          <Link href={`${ROUTES.LAPTOP}/${product.slug}`}>
            <h3 className="font-display font-bold text-lg text-text-primary mb-1 leading-snug hover:text-accent transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-text-secondary mb-3">
            {product.category.name}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[product.specs.processor, product.specs.gpu, product.specs.ram]
              .filter(Boolean)
              .map((spec) => (
                <span
                  key={spec}
                  className="font-mono text-[10px] bg-surface-alt text-text-secondary px-2 py-0.5 rounded"
                >
                  {spec}
                </span>
              ))}
          </div>
        </div>

        {/* Price + Actions */}
        <div className="flex flex-col items-start md:items-end justify-between md:border-l border-border md:pl-5 w-full md:w-44 shrink-0 gap-3">
          <p className="font-display font-bold text-2xl text-accent leading-none">
            {formatPrice(product.basePrice)}
          </p>

          <div className="flex flex-col gap-2 w-full">
            <Link href={`${ROUTES.LAPTOP}/${product.slug}`} className="w-full">
              <button className="w-full py-2 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer">
                Customize Build
              </button>
            </Link>
            <div className="flex gap-2 w-full">
              <Link
                href={`${ROUTES.LAPTOP}/${product.slug}#detail-configuration`}
                className="flex-1"
              >
                <button
                  className={`w-full py-1.5 flex items-center justify-center gap-1.5 border rounded-xl text-sm transition-all duration-150 cursor-pointer
                    ${
                      cartState === "added"
                        ? "border-green-500 bg-green-50 text-green-600"
                        : "border-border text-accent hover:bg-accent-muted hover:border-accent"
                    }`}
                >
                  {cartState === "loading" && (
                    <Loader2 size={13} className="animate-spin" />
                  )}
                  {cartState === "added" && <Check size={13} />}
                  {cartState === "idle" && <ShoppingCart size={13} />}
                  {cartState === "added" ? "Go Configure" : "Add to Cart"}
                </button>
              </Link>
              <button
                onClick={handleRemove}
                disabled={removing}
                title="Remove from wishlist"
                className="w-9 h-9 shrink-0 flex items-center justify-center border border-border text-text-muted hover:text-danger hover:border-danger/40 hover:bg-red-50 rounded-xl transition-all duration-150 disabled:opacity-50 cursor-pointer"
              >
                <Heart size={13} className="fill-current text-danger" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
