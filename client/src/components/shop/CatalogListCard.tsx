import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/src/lib/DataCatalog";

const badgeClasses: Record<string, string> = {
  NEW: "bg-accent text-white",
  FEATURED: "bg-warning text-white",
  "HOT DEAL": "bg-danger text-white",
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <span
            key={star}
            className="material-symbols-outlined text-warning text-[14px]"
            style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
          >
            {half ? "star_half" : "star"}
          </span>
        );
      })}
    </div>
  );
}

export default function CatalogListCard({ product }: { product: Product }) {
  return (
    
    <div className="group w-full bg-surface border border-border rounded-2xl overflow-hidden flex flex-row shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-border-strong">

      {/* ── IMAGE AREA ──────────────────────────────────────────
          w-[180px] flex-shrink-0 → lebar gambar TIDAK ikut menyusut
          h-auto / self-stretch → tinggi mengikuti tinggi card secara keseluruhan
      ──────────────────────────────────────────────────────── */}
      <div className="relative w-45 shrink-0 self-stretch bg-surface-alt flex items-center justify-center p-4">
        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badgeClasses[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
        <Image
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          width={160}
          height={120}
          className="w-full h-30 object-contain drop-shadow-md mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>

      {/*  CONTENT AREA */}
      <div className="flex flex-1 min-w-0 flex-col md:flex-row p-5 gap-4">

        {/* Info: brand / nama / stars / specs */}
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-1 font-semibold">
            {product.brand}
          </p>
          <h3 className="font-display font-bold text-lg text-text-primary mb-2 leading-snug truncate">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-3">
            <Stars rating={product.rating} />
            <span className="font-mono text-[11px] text-text-muted">
              ({product.reviewCount})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.specs.map((spec) => (
              <span
                key={spec}
                className="font-mono text-[10px] bg-surface-alt text-text-secondary px-2 py-0.5 rounded"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Price + CTA — lebar tetap, tidak menyusut */}
        <div className="flex flex-col items-start md:items-end justify-between md:border-l border-border md:pl-5 w-full md:w-42.5 shrink-0 gap-3">
          <div className="text-left md:text-right">
            {product.originalPrice && (
              <p className="font-mono text-xs text-text-muted line-through leading-none mb-0.5">
                {product.originalPrice}
              </p>
            )}
            <p className="font-display font-bold text-2xl text-accent leading-none">
              {product.price}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Link href={`/laptop/${product.slug}`} className="w-full">
              <button className="w-full py-2 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-xl transition-colors duration-150 cursor-pointer">
                Customize Build
              </button>
            </Link>
            <div className="flex gap-2 w-full">
              <button className="flex-1 py-1.5 flex items-center justify-center gap-1.5 border border-border text-accent hover:bg-[--color-accent-muted] hover:border-accent rounded-xl text-sm transition-all duration-150 cursor-pointer">
                <ShoppingCart size={13} /> Add
              </button>
              <button className="w-9 h-9 shrink-0 flex items-center justify-center border border-border text-text-muted hover:text-danger hover:border-danger/40 rounded-xl transition-all duration-150 cursor-pointer">
                <Heart size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}