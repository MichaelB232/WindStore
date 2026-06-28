"use client";

import { Review, timeAgo } from "@/src/lib/producttype/ReviewType";
import {
  AvatarBubble,
  StarRow,
} from "@/src/components/laptop/review/ReviewPrimitives";
import { useState } from "react";
import { ShieldCheck, ChevronDown } from "lucide-react";

const PAGE_SIZE = 4;

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  const listed = [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const shown = listed.slice(0, visible);
  const remaining = listed.length - visible;
  const hasMore = remaining > 0;

  return (
    <div className="space-y-4">
      {shown.map((review) => (
        <div
          key={review.id}
          className="rounded-2xl border border-border bg-surface p-5 shadow-card"
        >
          <div className="flex items-start gap-4">
            <AvatarBubble review={review} size={42} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <StarRow rating={Number(review.rating)} size={14} />
                <span className="flex items-center gap-1 text-xs text-success font-medium">
                  <ShieldCheck size={12} />
                  Verified Purchase
                </span>
                <span className="text-xs text-text-muted ml-auto">
                  {timeAgo(review.createdAt)}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-text-secondary leading-relaxed">
                  {review.comment}
                </p>
              )}
              <p className="mt-2 text-xs font-semibold text-text-primary">
                — {review.user.username}
              </p>
            </div>
          </div>
        </div>
      ))}

      {hasMore && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-accent hover:bg-accent-muted transition-colors cursor-pointer shadow-card"
        >
          <ChevronDown size={16} />
          Show {Math.min(remaining, PAGE_SIZE)} more
          <span className="text-text-muted font-normal">
            ({remaining} remaining)
          </span>
        </button>
      )}
    </div>
  );
}
