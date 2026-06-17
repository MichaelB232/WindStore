import HeroSection from "@/src/components/main/HeroSection";
import BrandMarquee from "@/src/components/main/BrandMarquee";
import CategorySection from "@/src/components/main/CategorySection";
import FeaturedSection from "@/src/components/main/FeaturedSection";

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
