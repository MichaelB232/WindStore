import Link from "next/link";
import {
  Gamepad2,
  Sun,
  Palette,
  BriefcaseBusiness,
  GraduationCap,
  Laptop,
} from "lucide-react";
import Container from "../layout/Container";
import { getAllProduct } from "@/src/services/shop/shop.service";
import { ROUTES } from "@/src/routes/routes";
import CategoryCard from "./CategoryCard";
import { AdminCategory } from "@/src/lib/admin/AdminType";

// Icon & deskripsi statis per nama kategori (dapat ditambah sesuai data DB)
const CATEGORY_META: Record<
  string,
  { icon: React.ReactNode; description: string }
> = {
  Gaming: {
    icon: <Gamepad2 size={28} />,
    description: "High-refresh displays, powerful GPUs & elite cooling",
  },
  Ultrabook: {
    icon: <Sun size={28} />,
    description: "Featherlight builds for all-day productivity",
  },
  "Creative Pro": {
    icon: <Palette size={28} />,
    description: "Color-accurate panels for designers & video editors",
  },
  Business: {
    icon: <BriefcaseBusiness size={28} />,
    description: "Enterprise security, durability & remote-work ready",
  },
  Student: {
    icon: <GraduationCap size={28} />,
    description: "Smart value with long battery life for campus life",
  },
};

const DEFAULT_META = {
  icon: <Laptop size={28} />,
  description: "Explore the full lineup",
};

export default async function CategorySection() {
  let categories: AdminCategory[] = [];

  try {
    const json = await getAllProduct();
    categories = json.data?.categories ?? [];
  } catch {
    categories = [];
  }

  if (categories.length === 0) return null;

  return (
    <section id="ShopCategory" className="border-b border-border">
      <Container>
        <div className="mt-10 mb-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-4xl font-display font-bold">
                Shop by Category
              </h2>
              <p className="text-xl text-text-muted mt-1">
                Find the perfect build for your needs
              </p>
            </div>
            <Link
              href={ROUTES.SHOP}
              className="font-display font-semibold text-accent hover:text-accent-hover transition-colors text-sm"
            >
              Browse All →
            </Link>
          </div>

          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((category) => {
              const meta = CATEGORY_META[category.name] ?? DEFAULT_META;

              return (
                <li key={category.id}>
                  <CategoryCard title={category.name} description={meta.description} />
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
