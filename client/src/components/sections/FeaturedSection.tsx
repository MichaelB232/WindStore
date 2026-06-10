import Container from "../layout/Container";
import { products } from "@/src/lib/DataProducts";
import { FeaturedCard } from "../ui/Card";
import { ShoppingCart } from "lucide-react";

export default function FeaturedSection() {
  return (
    <section id="FeaturedSection">
      <Container>
        <div className="">
          <div className="flex-row mb-10">
            <h2 className="font-display text-4xl font-bold">Featured Builds</h2>
            <p className="text-xl text-text-muted">New Arrivals This Week</p>
          </div>

          <div className="">
            <ul className="grid grid-flow-col auto-cols-80 gap-2 overflow-x-auto py-4">
              {products.map((product, idx) => (
                <li
                  key={idx}
                  className="relative shrink-0 w-80 border border-border bg-glass-bg  rounded-2xl transition-all duration-200 hover:border-accent hover:shadow-card-hover hover:-translate-y-2"
                >
                  {
                    <FeaturedCard
                      brand={product.brand}
                      name={product.name}
                      specs={product.specs}
                      price={product.price}
                      badge={product.badge}
                    />
                  }
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
