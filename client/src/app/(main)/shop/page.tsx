import CatalogClient from "@/src/components/shop/CatalogClient";
import { getAllProduct } from "@/src/services/shop/shop.service";

export const metadata = {
  title: "Shop Laptops — WindStore",
  description:
    "Browse gaming, professional, AI-powered, and creator laptops from the world's leading Windows brands.",
};

export default async function ShopPage() {
  const result = await getAllProduct();

  return (
    <CatalogClient
      products={result.data.products}
      brands={result.data.brands}
    />
  );
}
