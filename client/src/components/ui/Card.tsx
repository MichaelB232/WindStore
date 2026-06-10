type CardProps = {
  title: string;
  description: string;
  imageUrl: string;
};

import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({
  title,
  description,
  imageUrl,
}: CardProps) {
  return (
    <div className="group relative h-110 hover:bg-white/70 hover:border-white/80  overflow-visible transition-all duration-200 hover:shadow-card-hover">
      <div className="absolute top-0 w-full h-2 opacity-0 transition-all duration-200  group-hover:opacity-100 bg-accent" />
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
            Pelajari Selengkapnya
          </button>
        </Link>
      </div>
    </div>
  );
}
