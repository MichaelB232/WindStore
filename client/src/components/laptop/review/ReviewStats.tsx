import { Star, MessageSquare, BarChart2, ThumbsUp } from "lucide-react";
import { Review } from "@/src/lib/producttype/ReviewType";
import { StarRow } from "@/src/components/laptop/review/ReviewPrimitives";

function RatingBar({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-4 text-right text-text-secondary font-medium">
        {star}
      </span>
      <Star size={12} className="text-amber-400 shrink-0" fill="currentColor" />
      <div className="flex-1 h-2 rounded-full bg-surface-alt overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right text-text-muted">{count}</span>
    </div>
  );
}

export default function ReviewStats({ reviews }: { reviews: Review[] }) {
  const total = reviews.length;

  // Coerce each rating to Number in case the API returns strings
  const avg =
    total > 0
      ? reviews.reduce((sum, r) => sum + Number(r.rating), 0) / total
      : 0;

  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Number(r.rating) === star).length,
  }));

  const pctRecommend =
    total > 0
      ? Math.round(
          (reviews.filter((r) => Number(r.rating) >= 4).length / total) * 100,
        )
      : 0;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card sticky top-24 space-y-6">
      {/* Big score */}
      <div className="flex items-end gap-3">
        <span className="text-6xl font-display font-bold text-text-primary leading-none">
          {avg.toFixed(1)}
        </span>
        <div className="mb-1 space-y-1">
          <StarRow rating={avg} size={18} />
          <p className="text-xs text-text-muted">out of 5</p>
        </div>
      </div>

      {/* Per-star breakdown */}
      <div className="space-y-2">
        {dist.map(({ star, count }) => (
          <RatingBar key={star} star={star} count={count} total={total} />
        ))}
      </div>

      <div className="border-t border-border" />

      {/* Summary counters */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <MessageSquare size={15} className="text-accent shrink-0" />
          <span className="text-text-secondary">
            <strong className="text-text-primary">{total}</strong> ulasan
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <BarChart2 size={15} className="text-accent shrink-0" />
          <span className="text-text-secondary">
            <strong className="text-text-primary">{avg.toFixed(1)}</strong>{" "}
            rata-rata rating
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <ThumbsUp size={15} className="text-accent shrink-0" />
          <span className="text-text-secondary">
            <strong className="text-text-primary">{pctRecommend}%</strong>{" "}
            pembeli merekomendasikan
          </span>
        </div>
      </div>
    </div>
  );
}
