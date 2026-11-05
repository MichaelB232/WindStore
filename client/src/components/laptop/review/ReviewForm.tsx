"use client";

import { useEffect, useState } from "react";
import { Star, Loader2, LogIn, ShieldAlert, Edit3 } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import Link from "next/link";
import { ROUTES } from "@/src/routes/routes";
import {
  createReview,
  updateReview,
  checkCanReview,
} from "@/src/services/review/review.service";

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
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [existingReview, setExistingReview] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [eligibility, setEligibility] = useState<{
    loading: boolean;
    canReview: boolean;
    hasPurchased: boolean;
    hasReviewed: boolean;
  }>({
    loading: true,
    canReview: false,
    hasPurchased: false,
    hasReviewed: false,
  });

  useEffect(() => {
    if (!user) {
      setEligibility({
        loading: false,
        canReview: false,
        hasPurchased: false,
        hasReviewed: false,
      });
      return;
    }

    let cancelled = false;
    async function check() {
      const data = await checkCanReview(productId);
      if (!cancelled) {
        setEligibility({
          loading: false,
          canReview: data.canReview,
          hasPurchased: data.hasPurchased,
          hasReviewed: data.hasReviewed,
        });
        if (data.hasReviewed && data.review) {
          setExistingReview(data.review);
          setRating(Number(data.review.rating));
          setComment(data.review.comment || "");
        }
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [user, productId]);

  const active = hovered || rating;

  async function handleSubmit() {
    if (rating === 0) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      if (existingReview) {
        // Mode update
        const result = await updateReview(
          existingReview.id,
          rating,
          comment.trim() || undefined,
        );

        if (!result.success) {
          setStatus("error");
          setErrorMsg(
            result.message ?? "Gagal memperbarui ulasan. Silakan coba lagi.",
          );
          return;
        }

        setExistingReview({
          ...existingReview,
          rating,
          comment: comment.trim() || null,
        });
        setIsEditing(false);
        setStatus("idle");
        onSubmitted();
      } else {
        // Mode create
        const result = await createReview(
          productId,
          rating,
          comment.trim() || undefined,
        );

        if (result.status === 409) {
          setEligibility((prev) => ({
            ...prev,
            canReview: false,
            hasReviewed: true,
          }));
          return;
        }

        if (!result.success) {
          setStatus("error");
          setErrorMsg(
            result.message ?? "Gagal mengirim ulasan. Silakan coba lagi.",
          );
          return;
        }

        setExistingReview({
          rating,
          comment: comment.trim() || null,
        });
        setEligibility((prev) => ({
          ...prev,
          canReview: false,
          hasReviewed: true,
        }));
        setStatus("idle");
        onSubmitted();
      }
    } catch {
      setStatus("error");
      setErrorMsg("Terjadi kesalahan saat memproses ulasan.");
    }
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

  // Checking eligibility
  if (eligibility.loading) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-card text-center text-sm text-text-muted animate-pulse">
        Memeriksa status verifikasi pembeli…
      </div>
    );
  }

  // Not purchased yet
  if (!eligibility.hasPurchased) {
    return (
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-card flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <ShieldAlert size={18} />
          </div>
          <div>
            <p className="font-semibold text-text-primary">
              Khusus Pembeli Terverifikasi
            </p>
            <p className="text-sm text-text-muted mt-0.5">
              Hanya pengguna yang telah membeli dan menyelesaikan pesanan produk ini yang dapat memberikan ulasan.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent shrink-0">
          Verified Buyer Only
        </span>
      </div>
    );
  }

  // Already reviewed and not editing
  if (eligibility.hasReviewed && !isEditing) {
    return (
      <div className="rounded-3xl border border-accent-border bg-accent-muted p-6 shadow-card flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-accent">
              Anda sudah mengulas produk ini
            </p>
            {existingReview && (
              <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
                ★ {Number(existingReview.rating)} / 5
              </span>
            )}
          </div>
          {existingReview?.comment ? (
            <p className="text-sm text-text-secondary mt-1 italic">
              &ldquo;{existingReview.comment}&rdquo;
            </p>
          ) : (
            <p className="text-sm text-text-muted mt-0.5">
              Terima kasih atas ulasan dan masukan Anda.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setIsEditing(true);
            setRating(Number(existingReview?.rating || 5));
            setComment(existingReview?.comment || "");
          }}
          className="flex items-center gap-1.5 shrink-0 rounded-xl bg-white border border-accent/30 px-4 py-2 text-xs font-semibold text-accent hover:bg-accent hover:text-white transition-all shadow-2xs cursor-pointer"
        >
          <Edit3 size={13} />
          Edit Ulasan
        </button>
      </div>
    );
  }

  // Form (Create or Edit)
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-lg text-text-primary">
            {isEditing ? "Edit Ulasan Anda" : "Tulis Ulasan"}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Review as{" "}
            <span className="font-semibold text-text-primary">
              {user.username}
            </span>
          </p>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-xs text-text-muted hover:text-text-primary underline cursor-pointer"
          >
            Batal Edit
          </button>
        )}
      </div>

      {/* Star picker */}
      <div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="p-1 text-text-muted hover:scale-110 transition-transform cursor-pointer"
              aria-label={`Rate ${star} star`}
            >
              <Star
                size={24}
                className={
                  star <= active
                    ? "fill-amber-400 text-amber-400"
                    : "text-border"
                }
              />
            </button>
          ))}
          {active > 0 && (
            <span className="ml-2 text-sm font-semibold text-text-secondary">
              {LABELS[active - 1]}
            </span>
          )}
        </div>
        {status === "error" && rating === 0 && (
          <p className="text-xs text-danger mt-1">Please select a rating.</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagikan pengalaman performa, build quality, ketahanan baterai, dll…"
          rows={3}
          maxLength={1000}
          className="w-full rounded-2xl border border-border bg-surface-alt p-3.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none transition-colors"
        />
        <div className="flex justify-between items-center mt-1 text-xs text-text-muted">
          <span>Opsional</span>
          <span>{comment.length}/1000</span>
        </div>
      </div>

      {/* Error message */}
      {status === "error" && errorMsg && (
        <p className="text-xs text-danger">{errorMsg}</p>
      )}

      {/* Submit button */}
      <div className="flex justify-end gap-2">
        {isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Batal
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === "loading" || rating === 0}
          className="flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {status === "loading" && (
            <Loader2 size={15} className="animate-spin" />
          )}
          {status === "loading"
            ? "Menyimpan…"
            : isEditing
              ? "Simpan Perubahan"
              : "Kirim Ulasan"}
        </button>
      </div>
    </div>
  );
}
