import CatalogClient from "@/src/components/shop/CatalogClient";
import { getAllProduct } from "@/src/services/shop/shop.service";
import { ShopSearchParams } from "@/src/lib/producttype/ProductType";

export const metadata = {
  title: "Shop Laptops — WindStore",
  description:
    "Browse gaming, professional, AI-powered, and creator laptops from the world's leading Windows brands.",
};

interface ShopPageProps {
  searchParams: Promise<ShopSearchParams>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sp = await searchParams;

  const result = await getAllProduct({
    category: sp.category,
    brand: sp.brand ? sp.brand.split(",") : undefined,
    processor: sp.processor ? sp.processor.split(",") : undefined,
    search: sp.search,
    priceMin: sp.priceMin ? Number(sp.priceMin) : undefined,
    priceMax: sp.priceMax ? Number(sp.priceMax) : undefined,
    sortBy: sp.sortBy,
  });

  return (
    <CatalogClient
      products={result.data.products}
      brands={result.data.brands}
      categories={result.data.categories}
      processors={result.data.processors}
      initialFilters={sp}
    />
  );
}