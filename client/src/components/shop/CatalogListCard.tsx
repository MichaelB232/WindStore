"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/src/lib/producttype/ProductType";
import { ROUTES } from "@/src/routes/routes";
import { formatPrice } from "@/src/utils/utils";

const badgeClasses: Record<string, string> = {
  New: "bg-accent text-white",
  Premium: "bg-warning text-white",
  "Best Seller": "bg-danger text-white",
};

export default function CatalogListCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0;

  const specChips = [
    product.specs.processor,
    product.specs.gpu,
    product.specs.ram,
  ];

  return (
    <div className="group w-full bg-surface border border-border rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-border-strong">
      <Link
        href={`${ROUTES.LAPTOP}/${product.slug}`}
        className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0 bg-surface-alt flex items-center justify-center p-4"
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
          width={160}
          height={120}
          className={`w-full h-32 object-contain drop-shadow-md mix-blend-multiply transition-transform duration-300 group-hover:scale-105 ${outOfStock ? "grayscale opacity-50" : ""}`}
          unoptimized
        />
      </Link>

      <div className="flex flex-1 min-w-0 flex-col sm:flex-row p-4 sm:p-5 gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-1 font-semibold">
            {product.brand.name}
          </p>
          <h3 className="font-display font-bold text-base sm:text-lg text-text-primary mb-2 leading-snug truncate">
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

        <div className="flex flex-col items-start sm:items-end justify-between sm:border-l border-border sm:pl-5 w-full sm:w-44 shrink-0 gap-3 pt-3 sm:pt-0 border-t sm:border-t-0">
          <p className="font-display font-bold text-xl sm:text-2xl text-accent leading-none">
            {formatPrice(product.basePrice)}
          </p>
          <div className="flex flex-col gap-2 w-full">
            <Link href={`${ROUTES.LAPTOP}/${product.slug}`} className="w-full">
              <button className="w-full py-2 bg-accent hover:bg-accent-hover text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors duration-150 cursor-pointer">
                {outOfStock ? "View Details" : "Customize Build"}
              </button>
            </Link>
            <div className="flex gap-2 w-full">
              {outOfStock ? (
                <button
                  type="button"
                  disabled
                  title="Out of stock"
                  className="flex-1 py-1.5 flex items-center justify-center gap-1.5 border border-border text-text-muted rounded-xl text-xs sm:text-sm cursor-not-allowed opacity-50"
                >
                  <ShoppingCart size={13} /> Add
                </button>
              ) : (
                <Link
                  href={`${ROUTES.LAPTOP}/${product.slug}#detail-configuration`}
                  className="flex-1"
                >
                  <button className="w-full py-1.5 flex items-center justify-center gap-1.5 border border-border text-accent hover:bg-accent-muted hover:border-accent rounded-xl text-xs sm:text-sm transition-colors duration-150 cursor-pointer">
                    <ShoppingCart size={13} /> Add
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
