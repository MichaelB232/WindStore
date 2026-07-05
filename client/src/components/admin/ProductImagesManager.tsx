"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Star,
  Trash2,
  Loader2,
  ImageIcon,
  UploadCloud,
} from "lucide-react";
import EmptyState from "@/src/components/admin/EmptyState";
import ConfirmDialog from "@/src/components/admin/ConfirmDialog";
import { Button } from "@/src/components/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/src/components/ui/shadcn/dialog";
import {
  addProductImageAdmin,
  updateProductImageAdmin,
  deleteProductImageAdmin,
} from "@/src/services/admin/admin.service";
import { AdminProductImage } from "@/src/lib/admin/AdminType";
import { getErrorMessage } from "@/src/utils/utils";

export default function ProductImagesManager({
  productId,
  initialImages,
}: {
  productId: number;
  initialImages: AdminProductImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [prevInitialImages, setPrevInitialImages] = useState(initialImages);
  const [target, setTarget] = useState<AdminProductImage | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Keep local state in sync with the parent-provided data without an
  // effect: React recommends adjusting state during render (instead of
  // calling setState in a useEffect, which triggers an extra render pass)
  // when state needs to reset in response to a changed prop.
  if (initialImages !== prevInitialImages) {
    setPrevInitialImages(initialImages);
    setImages(initialImages);
  }

  const openCreate = () => {
    setFile(null);
    setIsPrimary(images.length === 0);
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image file");
      return;
    }
    setSubmitting(true);
    try {
      const created = (await addProductImageAdmin(
        productId,
        file,
        isPrimary,
      )) as AdminProductImage;
      setImages((prev) => [
        ...(isPrimary
          ? prev.map((img) => ({ ...img, isPrimary: false }))
          : prev),
        created,
      ]);
      toast.success("Image added successfully");
      setFormOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add image"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetPrimary = async (image: AdminProductImage) => {
    try {
      await updateProductImageAdmin(image.id, productId, true);
      setImages((prev) =>
        prev.map((img) => ({ ...img, isPrimary: img.id === image.id })),
      );
      toast.success("Primary image updated");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update image"));
    }
  };

  const handleDelete = async () => {
    if (!target) return;
    try {
      const message = await deleteProductImageAdmin(target.id);
      toast.success(message);
      setImages((prev) => prev.filter((img) => img.id !== target.id));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete image"));
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display font-bold text-text-primary">
          Gallery Images
        </h3>
        <Button type="button" size="sm" variant="outline" onClick={openCreate}>
          <Plus className="size-3.5" /> Add image
        </Button>
      </div>

      {images.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No gallery images yet"
          description="Add extra product photos shown on the detail page."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg border border-border"
            >
              <img
                src={image.imageUrl}
                alt=""
                className="aspect-square w-full object-cover"
              />
              {image.isPrimary && (
                <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-medium text-white">
                  <Star className="size-2.5 fill-white" /> Primary
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-linear-to-t from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                {!image.isPrimary && (
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="secondary"
                    onClick={() => handleSetPrimary(image)}
                    title="Set as primary"
                  >
                    <Star className="size-3.5" />
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon-sm"
                  variant="destructive"
                  onClick={() => setTarget(image)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add gallery image</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border-strong px-4 py-3 text-sm text-text-secondary hover:bg-surface-alt">
              <UploadCloud className="size-4" />
              {file ? file.name : "Choose an image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-text-primary">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="size-4 rounded border-border accent-accent"
              />
              Set as primary image
            </label>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Add image
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Delete image"
        description="Are you sure you want to delete this image?"
        onConfirm={handleDelete}
      />
    </div>
  );
}
