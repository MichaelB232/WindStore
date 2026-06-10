import HeroSection from "@/src/components/main_sections/HeroSection";
import BrandMarquee from "@/src/components/main_sections/BrandMarquee";
import CategorySection from "@/src/components/main_sections/CategorySection";
import FeaturedSection from "@/src/components/main_sections/FeaturedSection";

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
