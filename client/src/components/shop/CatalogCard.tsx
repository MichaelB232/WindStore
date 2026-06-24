import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/src/lib/DataCatalog";
import { ROUTES } from "@/src/routes/routes";

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

export default function CatalogCard({ product }: { product: Product }) {
  return (
    <div className="group h-full bg-surface border border-border rounded-2xl overflow-hidden flex flex-col shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover hover:border-border-strong">

      {/* Image area */}
      <div
        className="relative bg-surface-alt flex items-center justify-center p-4 overflow-hidden shrink-0"
        style={{ height: "170px" }}
      >
        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badgeClasses[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
        <button className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full text-text-muted hover:text-danger hover:bg-white transition-all duration-150 cursor-pointer shadow-sm">
          <Heart size={13} />
        </button>
        <Image
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          width={280}
          height={160}
          className="w-full h-full object-contain drop-shadow-md mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.04]"
          unoptimized
        />
      </div>

      {/* Body*/}
      <div className="p-4 flex flex-col flex-1 min-h-0">
        <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-1 font-semibold">
          {product.brand}
        </p>

        {/* Nama produk */}
        <h3 className="font-display font-bold text-[15px] leading-snug text-text-primary mb-2 line-clamp-2 min-h-[2.4em]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-2">
          <Stars rating={product.rating} />
          <span className="font-mono text-[11px] text-text-muted">
            ({product.reviewCount})
          </span>
        </div>

        {/* Specs*/}
        <div className="flex flex-wrap gap-1 mb-3 min-h-5.5">

          {product.specs.map((spec) => (
            <span
              key={spec}
              className="font-mono text-[10px] bg-surface-alt text-text-secondary px-2 py-0.5 rounded"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Price + CTA — mt-auto memastikan selalu di bawah */}
        <div className="mt-auto pt-3 border-t border-border">
          <div className="mb-2.5">
            {product.originalPrice && (
              <p className="font-mono text-xs text-text-muted line-through leading-none mb-0.5">
                {product.originalPrice}
              </p>
            )}
            <p className="font-display font-bold text-xl text-accent leading-none">
              {product.price}
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={`${ROUTES.LAPTOP}/${product.slug}`} className="flex-1 min-w-0">
              <button className="w-full py-2 bg-accent hover:bg-accent-hover text-white font-semibold text-xs rounded-xl transition-colors duration-150 cursor-pointer">
                Customize Build
              </button>
            </Link>
            <button className="w-8 h-8 shrink-0 flex items-center justify-center border border-border text-accent hover:bg-accent-muted hover:border-accent rounded-xl transition-all duration-150 cursor-pointer">
              <ShoppingCart size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}