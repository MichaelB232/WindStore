import { catalogProducts } from "@/src/lib/DataCatalog";
import Container from "@/src/components/layout/Container";
import DetailHero from "@/src/components/laptop/DetailHero";
import DetailDescription from "@/src/components/laptop/DetailDescription";
import DetailConfiguration from "@/src/components/laptop/DetailConfiguration";

export default async function LaptopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const laptop = catalogProducts.find((item) => item.slug === slug);
  if (!laptop) {
    throw new Error("Laptop not found");
  }

  return (
    <>
      <main className="py-24">
        <Container>
          <div className="">
            <DetailHero laptop={laptop} />
            <DetailDescription laptop={laptop}/>
            <DetailConfiguration/>
          </div>
        </Container>
      </main>
    </>
  );
}
