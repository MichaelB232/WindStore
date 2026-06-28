import { notFound } from "next/navigation";
import Container from "@/src/components/layout/Container";
import DetailHero from "@/src/components/laptop/DetailHero";
import DetailDescription from "@/src/components/laptop/DetailDescription";
import DetailConfiguration from "@/src/components/laptop/DetailConfiguration";
import { getProductBySlug } from "@/src/services/products/product.service";
import DetailReviews from "@/src/components/laptop/DetailReviews";

interface LaptopPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LaptopPage({ params }: LaptopPageProps) {
  const { slug } = await params;
  const laptop = await getProductBySlug(slug);

  if (!laptop) notFound();

  return (
    <main className="py-24">
      <Container>
        <div>
          <DetailHero laptop={laptop} />
          <DetailDescription laptop={laptop} />
          <DetailConfiguration laptop={laptop} />
          <DetailReviews laptop={laptop} />
        </div>
      </Container>
    </main>
  );
}