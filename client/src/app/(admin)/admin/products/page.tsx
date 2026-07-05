"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Loader2, Package } from "lucide-react";
import AdminTopbar from "@/src/components/admin/AdminTopbar";
import PageHeader from "@/src/components/admin/PageHeader";
import EmptyState from "@/src/components/admin/EmptyState";
import ConfirmDialog from "@/src/components/admin/ConfirmDialog";
import { Button } from "@/src/components/ui/shadcn/button";
import { Input } from "@/src/components/ui/shadcn/input";
import { ADMIN_ROUTES } from "@/src/routes/adminRoutes";
import { formatPrice, getErrorMessage } from "@/src/utils/utils";
import {
  getAllProductsAdmin,
  deleteProductAdmin,
} from "@/src/services/admin/admin.service";
import { AdminProductListItem } from "@/src/lib/admin/AdminType";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<AdminProductListItem | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAllProductsAdmin();
        setProducts(data);
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load products"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q),
    );
  }, [products, search]);

  const handleDelete = async () => {
    if (!target) return;
    try {
      const message = await deleteProductAdmin(target.id);
      toast.success(message);
      setProducts((prev) => prev.filter((p) => p.id !== target.id));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete product"));
    }
  };

  return (
    <>
      <AdminTopbar title="Products" description="Manage your product catalog" />

      <div className="p-8">
        <PageHeader
          title={`${filtered.length} product${filtered.length === 1 ? "" : "s"}`}
          action={
            <Button asChild size="sm">
              <Link href={ADMIN_ROUTES.PRODUCT_NEW}>
                <Plus className="size-4" /> Add product
              </Link>
            </Button>
          }
        />

        <div className="relative mb-4 max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search by name, brand, or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-accent" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products found"
            description={
              search
                ? "Try a different search term."
                : "Get started by adding your first product."
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-alt text-left text-xs font-medium text-text-secondary">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Reviews</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-alt/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="size-10 shrink-0 rounded-lg border border-border object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-text-primary">
                            {product.name}
                          </p>
                          <p className="truncate text-xs text-text-secondary">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {product.brand.name}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {product.category.name}
                    </td>
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {formatPrice(product.basePrice)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          product.stock <= 0
                            ? "font-medium text-danger"
                            : "text-text-secondary"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          product.isActive
                            ? "bg-success-bg text-success"
                            : "bg-surface-alt text-text-secondary"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {product._count.reviews}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild size="icon-sm" variant="ghost">
                          <Link href={ADMIN_ROUTES.PRODUCT_EDIT(product.id)}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-danger hover:bg-danger/10"
                          onClick={() => setTarget(product)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Delete product"
        description={`Are you sure you want to delete "${target?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
