import HeroSection from "@/src/components/main/HeroSection";
import BrandMarquee from "@/src/components/main/BrandMarquee";
// import CategorySection from "@/src/components/main/CategorySection";
import FeaturedSection from "@/src/components/main/FeaturedSection";

export const metadata = {
  title: "HomePage — WindStore",
  description:
    "Browse gaming, professional, AI-powered, and creator laptops from the world's leading Windows brands.",
};

export default function Home() {
  return (
    <>
      <main className="">
        <HeroSection/>
        <BrandMarquee/>
        {/* <CategorySection/> */}
        <FeaturedSection/>
      </main>
    </>
  );
}
