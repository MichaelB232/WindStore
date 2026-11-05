import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/src/routes/routes";

type CategoryCardProps = {
  title: string;
  description: string;
};

export default function CategoryCard({
  title,
  description,
}: CategoryCardProps) {
  return (
    <div className="group relative h-96 sm:h-110 hover:bg-white/70 hover:border-white/80 overflow-visible transition-all duration-200 hover:shadow-card-hover rounded-2xl bg-surface border border-border">
      <div className="absolute top-0 w-full h-1 opacity-0 transition-all duration-200 group-hover:opacity-100 bg-accent rounded-t-2xl" />
      {/* Content yang bergerak */}
      <div className="h-full transition-all duration-200 ease-out group-hover:-translate-y-10 sm:group-hover:-translate-y-14">
        {/* Gambar Laptop */}
        <div className="absolute top-0 left-0 w-full flex justify-center z-10 pt-4">
          <Image
            src="/Laptop_Images/ROG_Strix_Picture.png"
            alt={title}
            width={320}
            height={200}
            className="h-40 sm:h-56 w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)] transition-all duration-200 group-hover:scale-105"
          />
        </div>

        {/* Text */}
        <div className="h-full flex flex-col items-center pt-48 sm:pt-60 px-4 sm:px-6 cursor-default">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">{title}</h3>

          <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-text-secondary max-w-65">
            {description}
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="absolute bottom-0 left-0 w-full">
        <Link href={`${ROUTES.SHOP}?category=${encodeURIComponent(title)}`}>
          <button className="w-full py-3 sm:py-4 bg-accent text-white font-semibold transition-all duration-200 hover:bg-accent-hover opacity-0 group-hover:opacity-100 cursor-pointer rounded-b-2xl text-sm sm:text-base">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
}
