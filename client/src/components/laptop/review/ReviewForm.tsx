"use client";

import { useState } from "react";
import { Star, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import Link from "next/link";
import { ROUTES } from "@/src/routes/routes";
import { createReview } from "@/src/services/review/review.service";

const LABELS = ["Terrible", "Poor", "Okay", "Good", "Excellent"];

type Props = {
  productId: number;
  onSubmitted: () => void;
};

export default function ReviewForm({ productId, onSubmitted }: Props) {
  const { user } = useAuth();

  const [hovered, setHovered] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "already"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const active = hovered || rating;

  async function handleSubmit() {
    if (rating === 0) return;
    setStatus("loading");
    setErrorMsg("");

    const result = await createReview(
      productId,
      rating,
      comment.trim() || undefined,
    );

    if (result.status === 409) {
      setStatus("already");
      return;
    }

    if (!result.success) {
      setStatus("error");
      setErrorMsg(
        result.message ?? "Could not submit your review. Please try again.",
      );
      return;
    }

    setRating(0);
    setComment("");
    setStatus("idle");
    onSubmitted();
  }

  // Not logged in
  if (!user) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-card flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-text-primary">
            Share your experience
          </p>
          <p className="text-sm text-text-muted mt-0.5">
            Log in to leave a review for this product.
          </p>
        </div>
        <Link
          href={ROUTES.LOGIN}
          className="flex items-center gap-2 shrink-0 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
        >
          <LogIn size={15} />
          Log in
        </Link>
      </div>
    );
  }

  // Already reviewed
  if (status === "already") {
    return (
      <div className="rounded-3xl border border-accent-border bg-accent-muted p-6 shadow-card">
        <p className="font-semibold text-accent">
          You&apos;ve already reviewed this product
        </p>
        <p className="text-sm text-text-muted mt-0.5">
          Only one review per product is allowed.
        </p>
      </div>
    );
  }

  // Form
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card space-y-5">
      <div>
        <p className="font-semibold text-text-primary">Write a review</p>
        <p className="text-sm text-text-muted mt-0.5">
          Reviewing as{" "}
          <span className="font-medium text-text-primary">{user.username}</span>
        </p>
      </div>

      {/* Star picker */}
      <div>
        <label className="text-sm font-medium text-text-secondary mb-2 block">
          Rating <span className="text-danger">*</span>
        </label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const val = i + 1;
            const filled = val <= active;
            return (
              <button
                key={val}
                type="button"
                onClick={() => setRating(val)}
                onMouseEnter={() => setHovered(val)}
                onMouseLeave={() => setHovered(0)}
                aria-label={`Rate ${val} out of 5`}
                className="cursor-pointer transition-transform hover:scale-110 focus-visible:outline-none"
              >
                <Star
                  size={30}
                  className={filled ? "text-amber-400" : "text-border"}
                  fill={filled ? "currentColor" : "none"}
                />
              </button>
            );
          })}
          {active > 0 && (
            <span className="ml-2 text-sm font-medium text-text-secondary">
              {LABELS[active - 1]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="text-sm font-medium text-text-secondary mb-2 block">
          Comment{" "}
          <span className="text-text-muted font-normal">(optional)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this product…"
          rows={4}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
        />
      </div>

      {/* Error */}
      {status === "error" && <p className="text-sm text-danger">{errorMsg}</p>}

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={rating === 0 || status === "loading"}
        className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {status === "loading" && <Loader2 size={15} className="animate-spin" />}
        {status === "loading" ? "Submitting…" : "Submit Review"}
      </button>
    </div>
  );
}
