"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { toast } from "sonner";
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

export default function FeaturedCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const [cartState, setCartState] = useState<"idle" | "loading" | "added">(
    "idle",
  );
  const { isWishlisted, toggle } = useWishlist();
  

  const wishlisted = isWishlisted(product.id);
  const outOfStock = product.stock <= 0;
  const productHref = `${ROUTES.LAPTOP}/${product.slug}`;

  const specChips = [
    product.specs.processor,
    product.specs.gpu,
    product.specs.ram,
  ];
  
  const handleQuickAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    if (cartState !== "idle" || outOfStock) return;
    setCartState("loading");
    const result = await addToCart(product.id, product.defaultConfig!.id);
    if (result.success) {
      setCartState("added");
      toast.success(`${product.name} added to cart`);
      setTimeout(() => setCartState("idle"), 2000);
    } else {
      setCartState("idle");
      toast.error(result.message ?? "Failed to add to cart");
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
    <div className="relative overflow-hidden h-full">
      {/* Badge */}
      {product.badge && !outOfStock && (
        <span
          className={`absolute top-3 left-3 z-10 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
            badgeClasses[product.badge] ?? "bg-surface-alt text-text-secondary"
          }`}
        >
          {product.badge}
        </span>
      )}
      {outOfStock && (
        <span className="absolute top-3 left-3 z-10 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-text-primary text-white">
          Out of Stock
        </span>
      )}

      {/* Wishlist button */}
      <button
        onClick={handleWishlist}
        title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
        className={`absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full transition-all duration-150 cursor-pointer shadow-sm
          ${
            wishlisted
              ? "text-danger"
              : "text-text-muted hover:text-danger hover:bg-white"
          }`}
      >
        <Heart size={13} className={wishlisted ? "fill-current" : ""} />
      </button>

      {/* Card body — fully clickable link to detail page */}
      <Link href={productHref} className="flex flex-col px-3 pt-3">
        {/* Product image */}
        <div className="flex w-full h-45 justify-center items-center mb-3">
          <Image
            src={product.imageUrl}
            alt={`${product.brand.name} ${product.name}`}
            width={320}
            height={200}
            className={`h-44 w-auto object-contain drop-shadow-md transition-transform duration-300 hover:scale-105 ${
              outOfStock ? "grayscale opacity-50" : ""
            }`}
            unoptimized
          />
        </div>

        {/* Brand chip */}
        <div className="badge px-2 py-1 bg-violet-light w-fit rounded-md mb-3">
          <p className="text-accent-muted font-display font-bold text-sm">
            {product.brand.name}
          </p>
        </div>

        {/* Name */}
        <div className="mb-3 h-14 overflow-hidden">
          <p
            className="font-body font-bold text-2xl line-clamp-2"
            title={product.name}
          >
            {product.name}
          </p>
        </div>

        {/* Spec chips */}
        <div className="h-15">
          <div className="flex flex-wrap gap-1 mb-3">
            {specChips.map((spec) => (
              <span
                key={spec}
                className="font-mono text-[10px] bg-surface-alt text-text-secondary px-2 py-0.5 rounded"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="font-display font-bold text-2xl mb-5 ">
          {formatPrice(product.basePrice)}
        </div>
      </Link>

      {/* Action buttons — outside Link to avoid nested <a> */}
      <div className="flex flex-row justify-between gap-2 px-3 pb-4">
        <Link
          href={
            outOfStock ? productHref : `${productHref}#detail-configuration`
          }
          className="text-black flex-1 py-3 px-4 border border-border rounded-xl font-display font-bold text-md text-center transition-all duration-200 hover:border-accent-hover"
        >
          {outOfStock ? "View Details" : "Customize"}
        </Link>

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
          disabled={cartState === "loading" || outOfStock}
          className={`px-4 py-3 border rounded-xl cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2 font-display font-bold z-100
            ${
              cartState === "added"
                ? "bg-green-500 border-green-500 text-white"
                : "bg-accent hover:bg-accent-hover border-accent text-white"
            }`}
        >
          {cartState === "added" ? (
            <Check size={16} />
          ) : (
            <ShoppingCart
              size={16}
              className={cartState === "loading" ? "animate-pulse" : ""}
            />
          )}
          <span>{cartState === "added" ? "Added" : "Add"}</span>
        </button>
      </div>
    </div>
  );
}
