"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Loader2, Edit3 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/shadcn/dialog";
import {
  createReview,
  updateReview,
  checkCanReview,
} from "@/src/services/review/review.service";

const LABELS = ["Sangat Buruk", "Buruk", "Cukup", "Bagus", "Sangat Puas!"];

type OrderReviewDialogProps = {
  productId: number;
  productName: string;
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onReviewed?: () => void;
};

export default function OrderReviewDialog({
  productId,
  productName,
  imageUrl,
  isOpen,
  onClose,
  onReviewed,
}: OrderReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [existingReview, setExistingReview] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    async function load() {
      setChecking(true);
      setIsEditing(false);
      const data = await checkCanReview(productId);
      if (!cancelled) {
        if (data.hasReviewed && data.review) {
          setExistingReview(data.review);
          setRating(Number(data.review.rating));
          setComment(data.review.comment || "");
        } else {
          setExistingReview(null);
          setRating(0);
          setComment("");
        }
        setChecking(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [isOpen, productId]);

  const active = hovered || rating;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Silakan pilih rating bintang terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      if (existingReview) {
        // Mode edit
        const res = await updateReview(
          existingReview.id,
          rating,
          comment.trim() || undefined,
        );

        if (res.success) {
          toast.success("Ulasan berhasil diperbarui!");
          setExistingReview({
            ...existingReview,
            rating,
            comment: comment.trim() || null,
          });
          setIsEditing(false);
          onReviewed?.();
        } else {
          toast.error(res.message || "Gagal memperbarui ulasan");
        }
      } else {
        // Mode buat baru
        const res = await createReview(
          productId,
          rating,
          comment.trim() || undefined,
        );

        if (res.success) {
          toast.success("Ulasan berhasil dikirim! Terima kasih.");
          onReviewed?.();
          onClose();
        } else {
          toast.error(res.message || "Gagal mengirim ulasan");
        }
      }
    } catch {
      toast.error("Terjadi kesalahan saat memproses ulasan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">
            {isEditing
              ? "Edit Ulasan Anda"
              : existingReview
                ? "Ulasan Anda"
                : "Beri Ulasan Produk"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? "Perbarui rating atau komentar ulasan Anda."
              : existingReview
                ? "Ulasan yang telah Anda kirimkan untuk produk ini."
                : "Bagikan pengalaman Anda menggunakan produk ini kepada calon pembeli lain."}
          </DialogDescription>
        </DialogHeader>

        {/* Product snippet */}
        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-border bg-muted/40 p-3">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-white">
            <Image
              src={imageUrl}
              alt={productName}
              fill
              sizes="56px"
              className="object-contain p-1"
              unoptimized
            />
          </div>
          <p className="font-display font-semibold text-sm line-clamp-2 text-dark">
            {productName}
          </p>
        </div>

        {checking ? (
          <div className="py-8 text-center text-sm text-muted-foreground animate-pulse">
            Memeriksa ulasan…
          </div>
        ) : existingReview && !isEditing ? (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={22}
                  className={
                    star <= Number(existingReview.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-border"
                  }
                />
              ))}
              <span className="ml-2 text-xs font-semibold text-muted-foreground">
                ({Number(existingReview.rating)} / 5)
              </span>
            </div>
            {existingReview.comment && (
              <p className="rounded-xl border border-border/70 bg-muted/20 p-3 text-sm italic text-dark">
                &ldquo;{existingReview.comment}&rdquo;
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/5 px-4 py-2 text-xs font-semibold text-accent hover:bg-accent hover:text-white transition-colors cursor-pointer"
              >
                <Edit3 size={13} />
                Edit Ulasan
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-muted px-4 py-2 text-xs font-semibold text-dark hover:bg-muted/80 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Star Picker */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Rating Bintang
              </label>
              <div className="mt-1 flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="p-1 text-muted-foreground hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      size={26}
                      className={
                        star <= active
                          ? "fill-amber-400 text-amber-400"
                          : "text-border"
                      }
                    />
                  </button>
                ))}
                {active > 0 && (
                  <span className="ml-2 text-sm font-semibold text-accent">
                    {LABELS[active - 1]}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Ulasan Anda (Opsional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ceritakan performa, build quality, ketahanan baterai, dll…"
                rows={3}
                maxLength={500}
                className="mt-1 w-full rounded-2xl border border-border bg-white p-3 text-sm text-dark placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none transition-colors"
              />
              <div className="flex justify-between items-center text-[11px] text-muted-foreground mt-0.5">
                <span>Maksimal 500 karakter</span>
                <span>{comment.length}/500</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (existingReview) {
                    setIsEditing(false);
                    setRating(Number(existingReview.rating));
                    setComment(existingReview.comment || "");
                  } else {
                    onClose();
                  }
                }}
                disabled={loading}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || rating === 0}
                className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2 text-xs font-semibold text-white hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading && <Loader2 size={13} className="animate-spin" />}
                {loading
                  ? "Menyimpan…"
                  : isEditing
                    ? "Simpan Perubahan"
                    : "Kirim Ulasan"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
