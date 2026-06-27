"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductDetail } from "@/src/lib/producttype/ProductType";
import { formatPrice } from "@/src/utils/utils";

type DetailHeroProps = {
  laptop: ProductDetail;
};

export default function DetailHero({ laptop }: DetailHeroProps) {
  const images =
    laptop.productImages.length > 0
      ? laptop.productImages.map((img) => img.imageUrl)
      : [laptop.imageUrl];

  const [activeIdx, setActiveIdx] = useState(0);

  const specChips = [
    laptop.specs.processor,
    laptop.specs.gpu,
    laptop.specs.ram,
    laptop.specs.storage,
    laptop.specs.display,
  ].filter(Boolean);

  return (
    <section id="detail-hero">
      <div className="grid grid-cols-12 gap-10">
        {/* Left — gallery */}
        <div className="col-span-7">
          <div className="space-y-4">
            {/* Main image */}
            <div className="w-full aspect-16/10 rounded-xl bg-white shadow-card border border-border p-8">
              <div className="relative w-full h-full">
                <Image
                  src={images[activeIdx]}
                  alt={laptop.name}
                  fill
                  className="object-contain"
                  sizes="(max-width:768px) 100vw, 50vw"
                  unoptimized
                />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`aspect-16/10 overflow-hidden rounded-md border p-3 bg-white shadow-card transition-all cursor-pointer ${
                    activeIdx === idx
                      ? "border-accent ring-1 ring-accent"
                      : "border-border hover:border-accent"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={src}
                      alt={`${laptop.name} view ${idx + 1}`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — info */}
        <div className="col-span-5 flex flex-col justify-center">
          <p className="font-mono text-xs text-accent uppercase tracking-widest mb-2 font-semibold">
            {laptop.brand.name}
          </p>

          <h1 className="text-5xl font-bold tracking-tight">{laptop.name}</h1>
          <p className="mt-3 text-muted-foreground">{laptop.motto}</p>

          <p className="mt-8 text-3xl font-bold text-accent">
            {formatPrice(laptop.basePrice)}
          </p>

          {/* Spec chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {specChips.map((spec) => (
              <span
                key={spec}
                className="font-mono text-sm bg-surface-alt text-text-secondary px-2 py-0.5 rounded"
              >
                {spec}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex gap-3">
            <Link
              href="#detail-configuration"
              className="flex-1 rounded-xl bg-accent py-4 font-semibold text-center text-white transition duration-200 ease-in hover:bg-accent-hover hover:cursor-pointer hover:shadow-card-hover"
            >
              Configure Now
            </Link>
            <button className="size-14 rounded-xl border border-border flex justify-center items-center bg-white/90 backdrop-blur-sm text-text-muted hover:text-danger hover:bg-white transition-all duration-200 cursor-pointer shadow-sm">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}