"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { ProductDetail } from "@/src/lib/producttype/ProductType";
import { Review } from "@/src/lib/producttype/ReviewType";
import ReviewStats from "@/src/components/laptop/review/ReviewStats";
import ReviewList from "@/src/components/laptop/review/ReviewList";
import ReviewForm from "@/src/components/laptop/review/ReviewForm";
import { getReviewsByProduct } from "@/src/services/review/review.service";

type Props = { laptop: ProductDetail };

export default function DetailReviews({ laptop }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const data = await getReviewsByProduct(laptop.id);
        if (!cancelled) setReviews(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [laptop.id, refreshKey]);

  const total = reviews.length;

  return (
    <section id="review-section" className="mt-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-display font-bold">Customer Reviews</h2>
        {total > 0 && (
          <span className="text-sm text-text-muted">
            {total} {total === 1 ? "review" : "reviews"}
          </span>
        )}
      </div>

      {/* Review input form */}
      <div className="mb-8">
        <ReviewForm
          productId={laptop.id}
          onSubmitted={() => setRefreshKey((k) => k + 1)}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-3xl border border-border bg-surface p-10 text-center text-text-muted shadow-card animate-pulse">
          Fetching reviews…
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-3xl border border-danger/30 bg-danger-bg p-8 text-center text-danger text-sm">
          Could not load reviews. Please try again later.
        </div>
      )}

      {/* Empty */}
      {!loading && !error && total === 0 && (
        <div className="rounded-3xl border border-border bg-surface p-12 text-center shadow-card">
          <MessageSquare size={40} className="mx-auto mb-4 text-text-muted" />
          <p className="font-semibold text-text-primary">No reviews yet</p>
          <p className="mt-1 text-sm text-text-muted">
            Be the first to share your experience with this laptop.
          </p>
        </div>
      )}

      {/* Main content */}
      {!loading && !error && total > 0 && (
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4">
            <ReviewStats reviews={reviews} />
          </div>
          <div className="col-span-8">
            <ReviewList reviews={reviews} />
          </div>
        </div>
      )}
    </section>
  );
}
