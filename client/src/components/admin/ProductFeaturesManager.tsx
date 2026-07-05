"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, ListChecks } from "lucide-react";
import EmptyState from "@/src/components/admin/EmptyState";
import ConfirmDialog from "@/src/components/admin/ConfirmDialog";
import { Button } from "@/src/components/ui/shadcn/button";
import { Input } from "@/src/components/ui/shadcn/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/src/components/ui/shadcn/dialog";
import {
  createProductFeatureAdmin,
  updateProductFeatureAdmin,
  deleteProductFeatureAdmin,
} from "@/src/services/admin/admin.service";
import { AdminProductFeature } from "@/src/lib/admin/AdminType";
import { getErrorMessage } from "@/src/utils/utils";

export default function ProductFeaturesManager({
  productId,
  initialFeatures,
}: {
  productId: number;
  initialFeatures: AdminProductFeature[];
}) {
  const [features, setFeatures] = useState(initialFeatures);
  const [prevInitialFeatures, setPrevInitialFeatures] =
    useState(initialFeatures);
  const [target, setTarget] = useState<AdminProductFeature | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProductFeature | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Adjust state during render instead of in a useEffect: this avoids the
  // extra "commit -> effect -> setState -> re-render" pass that comes from
  // syncing state to a prop inside useEffect.
  if (initialFeatures !== prevInitialFeatures) {
    setPrevInitialFeatures(initialFeatures);
    setFeatures(initialFeatures);
  }

  const openCreate = () => {
    setEditing(null);
    setTitle("");
    setDescription("");
    setFormOpen(true);
  };

  const openEdit = (feature: AdminProductFeature) => {
    setEditing(feature);
    setTitle(feature.title);
    setDescription(feature.description);
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        const updated = await updateProductFeatureAdmin(editing.id, {
          title,
          description,
        });
        setFeatures((prev) =>
          prev.map((f) => (f.id === editing.id ? updated : f)),
        );
        toast.success("Feature updated successfully");
      } else {
        const created = await createProductFeatureAdmin({
          productId: String(productId),
          title,
          description,
        });
        setFeatures((prev) => [...prev, created]);
        toast.success("Feature added successfully");
      }
      setFormOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save feature"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!target) return;
    try {
      const message = await deleteProductFeatureAdmin(target.id);
      toast.success(message);
      setFeatures((prev) => prev.filter((f) => f.id !== target.id));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete feature"));
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display font-bold text-text-primary">Features</h3>
        <Button type="button" size="sm" variant="outline" onClick={openCreate}>
          <Plus className="size-3.5" /> Add feature
        </Button>
      </div>

      {features.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No features yet"
          description="Highlight key selling points for this product."
        />
      ) : (
        <ul className="space-y-2">
          {features.map((feature) => (
            <li
              key={feature.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  {feature.title}
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {feature.description}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => openEdit(feature)}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="text-danger hover:bg-danger/10"
                  onClick={() => setTarget(feature)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit feature" : "Add feature"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Advanced Cooling"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                placeholder="Dual-fan vapor chamber keeps thermals in check under load."
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {editing ? "Save changes" : "Add feature"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Delete feature"
        description={`Are you sure you want to delete "${target?.title}"?`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
