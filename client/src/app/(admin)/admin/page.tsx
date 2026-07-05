"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Users,
  Building2,
  Tags,
  PackageX,
  Star,
  Plus,
  ArrowRight,
} from "lucide-react";
import AdminTopbar from "@/src/components/admin/AdminTopbar";
import StatCard from "@/src/components/admin/StatCard";
import { Button } from "@/src/components/ui/shadcn/button";
import { ADMIN_ROUTES } from "@/src/routes/adminRoutes";
import { formatPrice, getErrorMessage } from "@/src/utils/utils";
import {
  getAllProductsAdmin,
  getAllUsersAdmin,
  getAllBrandsAdmin,
  getAllCategoriesAdmin,
} from "@/src/services/admin/admin.service";
import { AdminProductListItem, AdminUser } from "@/src/lib/admin/AdminType";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<AdminProductListItem[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [brandCount, setBrandCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productData, userData, brandData, categoryData] =
          await Promise.all([
            getAllProductsAdmin(),
            getAllUsersAdmin(),
            getAllBrandsAdmin(),
            getAllCategoriesAdmin(),
          ]);
        setProducts(productData);
        setUsers(userData);
        setBrandCount(brandData.length);
        setCategoryCount(categoryData.length);
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load dashboard data"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const activeProducts = products.filter((p) => p.isActive).length;
  const outOfStock = products.filter((p) => p.stock <= 0).length;
  const totalReviews = products.reduce((sum, p) => sum + p._count.reviews, 0);
  const inventoryValue = products.reduce(
    (sum, p) => sum + Number(p.basePrice) * p.stock,
    0,
  );
  const customerCount = users.filter((u) => u.role === "customer").length;
  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <>
      <AdminTopbar
        title="Dashboard"
        description="Overview of your store's products, users, and catalog"
      />

      <div className="p-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-accent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Products"
                value={products.length}
                icon={Package}
                accent="accent"
              />
              <StatCard
                label="Active Products"
                value={activeProducts}
                icon={Star}
                accent="success"
              />
              <StatCard
                label="Out of Stock"
                value={outOfStock}
                icon={PackageX}
                accent="warning"
              />
              <StatCard
                label="Customers"
                value={customerCount}
                icon={Users}
                accent="violet"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Brands"
                value={brandCount}
                icon={Building2}
                accent="accent"
              />
              <StatCard
                label="Categories"
                value={categoryCount}
                icon={Tags}
                accent="accent"
              />
              <StatCard
                label="Total Reviews"
                value={totalReviews}
                icon={Star}
                accent="violet"
              />
              <StatCard
                label="Inventory Value"
                value={formatPrice(inventoryValue)}
                icon={Package}
                accent="success"
              />
            </div>

            <div className="mt-8 rounded-xl border border-border bg-surface shadow-card">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h3 className="font-display font-bold text-text-primary">
                  Recently Added Products
                </h3>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={ADMIN_ROUTES.PRODUCTS}>
                      View all <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={ADMIN_ROUTES.PRODUCT_NEW}>
                      <Plus className="size-3.5" /> Add product
                    </Link>
                  </Button>
                </div>
              </div>

              {recentProducts.length === 0 ? (
                <p className="px-6 py-8 text-center text-sm text-text-secondary">
                  No products yet.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {recentProducts.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between px-6 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="size-10 rounded-lg border border-border object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {product.name}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {product.brand.name} · {product.category.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-text-primary">
                          {formatPrice(product.basePrice)}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            product.isActive
                              ? "bg-success-bg text-success"
                              : "bg-surface-alt text-text-secondary"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
