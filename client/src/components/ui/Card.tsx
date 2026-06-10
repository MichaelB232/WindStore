type CategoryCardProps = {
  title: string;
  description: string;
  imageUrl: string;
};

type FeaturedCardProps = {
  brand: string;
  name: string;
  specs: string;
  price: string;
  badge?: string;
};

import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({
  title,
  description,
  imageUrl,
}: CategoryCardProps) {
  return (
    <div className="group relative h-110 hover:bg-white/70 hover:border-white/80  overflow-visible transition-all duration-200 hover:shadow-card-hover">
      <div className="absolute top-0 w-full h-1 opacity-0 transition-all duration-200  group-hover:opacity-100 bg-accent" />
      {/* Content yang bergerak */}
      <div className="h-full transition-all duration-200 ease-out group-hover:-translate-y-14">
        {/* Gambar Laptop */}
        <div className="absolute top-0 left-0 w-full flex justify-center z-10">
          <Image
            src={imageUrl}
            alt={title}
            width={320}
            height={200}
            className="h-56 w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)] transition-all duration-200 group-hover:scale-105"
          />
        </div>

        {/* Text */}
        <div className="h-full flex flex-col items-center pt-60 px-6 cursor-default">
          <h3 className="text-4xl font-bold text-center">{title}</h3>

          <p className="mt-4 text-center text-text-secondary max-w-65">
            {description}
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="absolute bottom-0 left-0 w-full">
        <Link href="#">
          <button className="w-full py-4 bg-accent text-white font-semibold transition-all duration-200 hover:bg-accent-hover opacity-0 group-hover:opacity-100 cursor-pointer">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
}

export function FeaturedCard({
  brand,
  name,
  specs,
  price,
  badge,
}: FeaturedCardProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-5 left-45 w-50 text-center bg-violet text-accent-muted z-10 rotate-45 text-sm font-display">
        {badge}
      </div>

      <div className="relative w-full h-120 flex flex-col px-3">
        <div className="flex w-full h-45 justify-center mb-3">
          <Image
            src="/Laptop_Images/ROG_Strix_Picture.png"
            alt="gambar laptop"
            width={320}
            height={200}
            className="h-56 w-auto"
          ></Image>
        </div>
        <div className="flex flex-col">
          <div className="badge px-3 py-2 bg-violet-light w-fit rounded-xl mb-3">
            <p className="text-accent-muted font-display font-bold">{brand}</p>
          </div>
          <div className="name mb-3 h-14 overflow-auto">
            <p
              className="font-body font-bold text-2xl line-clamp-2"
              title={name}
            >
              {name}
            </p>
          </div>

          <div className="specs line-clamp-1 mb-3" title={specs}>
            {specs}
          </div>

          <div className="font-mono font-bold text-2xl mb-5">{price}</div>
          <div className="button-container flex flex-row justify-between">
            <div className="customize-button py-3 px-6 border border-border rounded-xl cursor-pointer transition-all duration-200 hover:border-accent-hover font-display font-bold ">
              <Link href="#">
                <button className="cursor-pointer transition-all duration-200 opacity-100 hover:opacity-95">
                  Customize
                </button>
              </Link>
            </div>

            <div className="cta-shopping px-10 py-3 border border-border rounded-xl cursor-pointer bg-accent transition-colors duration-200 hover:bg-accent-hover items-center">
              <Link href="#">
                <button className="flex flex-row gap-2 cursor-pointer font-display font-bold text-accent-muted">
                  <ShoppingCart size={20}/> 
                  <p>Add</p>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
