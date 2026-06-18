import { Product } from "@/src/lib/DataCatalog";
import { Heart } from "lucide-react";
import Link from "next/link";

type DetailPageHeroProps = {
  laptop: Product;
};

import Image from "next/image";

export default function DetailHero({ laptop }: DetailPageHeroProps) {
  return (
    <section id="detail-hero">
      <div className="grid grid-cols-12 gap-10">
        {/* Left Items */}
        <div className="col-span-7">
          <div className="space-y-4">
            {/* Gallery Image */}
            <div className="w-full aspect-16/10 rounded-xl bg-white shadow-card border border-border p-8">
              <div className="relative w-full h-full">
                <Image
                  src={laptop.image}
                  alt={laptop.name}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <button
                  key={index}
                  className="aspect-16/10 overflow-hidden rounded-md border border-border p-3 bg-white shadow-card"
                >
                  <div className="relative w-full h-full ">
                    <Image
                      src={laptop.image}
                      alt={laptop.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Items */}
        <div className="col-span-5 flex flex-col justify-center">
          <h1 className="text-5xl font-bold tracking-tight">{laptop.name}</h1>

          {/* Title */}
          <p className="mt-3 text-muted-foreground">{laptop.motto}</p>

          {/* Price Tag */}
          <p className="mt-8 text-5xl font-bold text-accent">{laptop.price}</p>

          {/* Spec Tag */}
          <div className="mt-6 flex flex-wrap gap-2 ">
            {laptop.specs.map((spec) => (
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

            <button className="size-14 rounded-xl border border-border flex justify-center items-center g-white/90 backdrop-blur-sm text-text-muted hover:text-danger hover:bg-white transition-all duration-200 cursor-pointer shadow-sm">
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
