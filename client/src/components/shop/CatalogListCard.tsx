"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/src/lib/producttype/ProductType";
import { ROUTES } from "@/src/routes/routes";
import { formatPrice } from "@/src/utils/utils";
import { useWishlist } from "@/src/services/wishlist/context/WishlistContext";

const badgeClasses: Record<string, string> = {
  New: "bg-accent text-white",
  Premium: "bg-warning text-white",
  "Best Seller": "bg-danger text-white",
};

export default function CatalogListCard({ product }: { product: Product }) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const specChips = [
    product.specs.processor,
    product.specs.gpu,
    product.specs.ram,
  ];

  return (
    <div className="group w-full bg-surface border border-border rounded-2xl overflow-hidden flex flex-row shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-border-strong">
      <Link
        href={`${ROUTES.LAPTOP}/${product.slug}`}
        className="relative w-45 shrink-0 self-stretch bg-surface-alt flex items-center justify-center p-4"
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
          alt={`${product.brand.name} ${product.name}`}
          width={160}
          height={120}
          className="w-full h-30 object-contain drop-shadow-md mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </Link>

      <div className="flex flex-1 min-w-0 flex-col md:flex-row p-5 gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-1 font-semibold">
            {product.brand.name}
          </p>
          <h3 className="font-display font-bold text-lg text-text-primary mb-2 leading-snug truncate">
            {product.name}
          </h3>
          <p className="text-xs text-text-secondary mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
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

        <div className="flex flex-col items-start md:items-end justify-between md:border-l border-border md:pl-5 w-full md:w-42.5 shrink-0 gap-3">
          <p className="font-display font-bold text-2xl text-accent leading-none">
            {formatPrice(product.basePrice)}
          </p>
          <div className="flex flex-col gap-2 w-full">
            <Link href={`${ROUTES.LAPTOP}/${product.slug}`} className="w-full">
              <button className="w-full py-2 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-xl transition-colors duration-150 cursor-pointer">
                Customize Build
              </button>
            </Link>
            <div className="flex gap-2 w-full">
              <Link
                href={`${ROUTES.LAPTOP}/${product.slug}#detail-configuration`}
                className="flex-1"
              >
                <button className="w-full py-1.5 flex items-center justify-center gap-1.5 border border-border text-accent hover:bg-accent-muted hover:border-accent rounded-xl text-sm transition-all duration-150 cursor-pointer">
                  <ShoppingCart size={13} /> Add
                </button>
              </Link>
              <button
                onClick={() => toggle(product.id)}
                title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
                className={`w-9 h-9 shrink-0 flex items-center justify-center border rounded-xl transition-all duration-150 cursor-pointer
                  ${wishlisted ? "border-danger/40 text-danger bg-red-50" : "border-border text-text-muted hover:text-danger hover:border-danger/40"}`}
              >
                <Heart size={13} className={wishlisted ? "fill-current" : ""} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
