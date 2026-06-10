import HeroSection from "@/src/components/sections/HeroSection";
import BrandMarquee from "@/src/components/sections/BrandMarquee";
import CategorySection from "@/src/components/sections/CategorySection";
import FeaturedSection from "@/src/components/sections/FeaturedSection";

export default function Home() {
  return (
    <>
      <main className="">
        <HeroSection/>
        <BrandMarquee/>
        <CategorySection/>
        <FeaturedSection/>
      </main>
    </>
  );
}
