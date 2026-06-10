import HeroSection from "@/src/components/sections/HeroSection";
import BrandMarquee from "@/src/components/sections/BrandMarquee";
import CategorySection from "@/src/components/sections/CategorySection";

export default function Home() {
  return (
    <>
      <main className="">
        <HeroSection/>
        <BrandMarquee/>
        <CategorySection/>
      </main>
    </>
  );
}
