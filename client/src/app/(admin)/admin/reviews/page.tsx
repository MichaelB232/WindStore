"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Loader2, Star, MessageSquareOff } from "lucide-react";
import AdminTopbar from "@/src/components/admin/AdminTopbar";
import PageHeader from "@/src/components/admin/PageHeader";
import EmptyState from "@/src/components/admin/EmptyState";
import ConfirmDialog from "@/src/components/admin/ConfirmDialog";
import { Button } from "@/src/components/ui/shadcn/button";
import {
  getAllProductsAdmin,
  getReviewsByProductAdmin,
  deleteReviewAdmin,
} from "@/src/services/admin/admin.service";
import { AdminProductListItem, AdminReview } from "@/src/lib/admin/AdminType";
import { getErrorMessage } from "@/src/utils/utils";

export default function AdminReviewsPage() {
  const [products, setProducts] = useState<AdminProductListItem[]>([]);
  const [productId, setProductId] = useState<string>("");
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [target, setTarget] = useState<AdminReview | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllProductsAdmin();
        setProducts(data);
        if (data.length > 0) setProductId(String(data[0].id));
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load products"));
      } finally {
        setLoadingProducts(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadReviews = async (id: string) => {
      if (!id) return;
      setLoadingReviews(true);
      try {
        const data = await getReviewsByProductAdmin(Number(id));
        setReviews(data);
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load reviews"));
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (productId) loadReviews(productId);
  }, [productId]);

  const handleDelete = async () => {
    if (!target) return;
    try {
      const message = await deleteReviewAdmin(target.id);
      toast.success(message);
      setReviews((prev) => prev.filter((r) => r.id !== target.id));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete review"));
    }
  };

  return (
    <>
      <AdminTopbar
        title="Reviews"
        description="Moderate customer reviews per product (showing most recent 5)"
      />

      <div className="p-8">
        <PageHeader title="Select a product" />

        {loadingProducts ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-accent" />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No products yet"
            description="Add a product first."
          />
        ) : (
          <>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mb-6 h-9 w-full max-w-sm rounded-lg border border-input bg-surface px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p._count.reviews} reviews)
                </option>
              ))}
            </select>

            {loadingReviews ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="size-6 animate-spin text-accent" />
              </div>
            ) : reviews.length === 0 ? (
              <EmptyState
                icon={MessageSquareOff}
                title="No reviews for this product"
                description="This product hasn't received any customer reviews yet."
              />
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-border bg-surface p-4 shadow-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text-primary">
                            {review.user?.username ?? "Unknown user"}
                          </span>
                          <span className="flex items-center gap-0.5 text-sm font-medium text-warning">
                            <Star className="size-3.5 fill-warning" />{" "}
                            {review.rating}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="mt-1.5 text-sm text-text-secondary">
                            {review.comment}
                          </p>
                        )}
                        <p className="mt-1.5 text-xs text-text-muted">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="shrink-0 text-danger hover:bg-danger/10"
                        onClick={() => setTarget(review)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Delete review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </>
  );
}
