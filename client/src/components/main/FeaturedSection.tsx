import Link from "next/link";
import Container from "../layout/Container";
import {
  getProduct,
  getProductBySlug,
} from "@/src/services/products/product.service";
import { Product } from "@/src/lib/producttype/ProductType";
import { ROUTES } from "@/src/routes/routes";
import FeaturedCard from "./FeaturedCard";

export default async function FeaturedSection() {
  let products: Product[] = [];

  try {
    const json = await getProduct();
    const rawProducts: Product[] = json.data ?? json ?? [];

    // Ambil 8 produk saja
    const limited = rawProducts.slice(0, 8);

    const settled = await Promise.allSettled(
      limited.map((p) => getProductBySlug(p.slug))
    );

    // Filter yang null/gagal fetch
    products = settled
      .filter((r) => r.status === "fulfilled" && r.value !== null)
      .map((r) => (r as PromiseFulfilledResult<Product>).value);

  } catch {
    products = [];
  }

  return (
    <section id="FeaturedSection" className="border-b border-border">
      <Container>
        <div className="mb-10 mt-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-4xl font-bold">
                Featured Builds
              </h2>
              <p className="text-xl text-text-muted">New Arrivals This Week</p>
            </div>
            <Link
              href={ROUTES.SHOP}
              className="font-display font-semibold text-accent hover:text-accent-hover transition-colors text-sm"
            >
              View All →
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="text-text-muted py-10 text-center">
              No products available right now.
            </p>
          ) : (
            <ul className="grid grid-flow-col auto-cols-80 gap-2 overflow-x-auto py-4">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="relative shrink-0 w-80 border border-border bg-glass-bg rounded-2xl transition-all duration-200 hover:border-accent hover:shadow-card-hover hover:-translate-y-2"
                >
                  <FeaturedCard product={product} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
