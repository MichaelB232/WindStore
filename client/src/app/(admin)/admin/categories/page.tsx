"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Tags } from "lucide-react";
import AdminTopbar from "@/src/components/admin/AdminTopbar";
import PageHeader from "@/src/components/admin/PageHeader";
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
  getAllCategoriesAdmin,
  createCategoryAdmin,
  updateCategoryAdmin,
  deleteCategoryAdmin,
} from "@/src/services/admin/admin.service";
import { AdminCategory } from "@/src/lib/admin/AdminType";
import { getErrorMessage } from "@/src/utils/utils";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<AdminCategory | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAllCategoriesAdmin();
        setCategories(data);
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load categories"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setFormOpen(true);
  };

  const openEdit = (category: AdminCategory) => {
    setEditing(category);
    setName(category.name);
    setFormOpen(true);
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllCategoriesAdmin();
      setCategories(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load categories"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        await updateCategoryAdmin(editing.id, name);
        toast.success("Category updated successfully");
      } else {
        await createCategoryAdmin(name);
        toast.success("Category added successfully");
      }
      setFormOpen(false);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save category"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!target) return;
    try {
      const message = await deleteCategoryAdmin(target.id);
      toast.success(message);
      setCategories((prev) => prev.filter((c) => c.id !== target.id));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete category"));
    }
  };
  return (
    <>
      <AdminTopbar title="Categories" description="Manage product categories" />

      <div className="p-8">
        <PageHeader
          title={`${categories.length} categor${categories.length === 1 ? "y" : "ies"}`}
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" /> Add category
            </Button>
          }
        />

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-accent" />
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={Tags}
            title="No categories yet"
            description="Add a category to organize your products."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-alt text-left text-xs font-medium text-text-secondary">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-surface-alt/50">
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {category.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => openEdit(category)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-danger hover:bg-danger/10"
                          onClick={() => setTarget(category)}
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

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit category" : "Add category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Gaming"
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
                {editing ? "Save changes" : "Add category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Delete category"
        description={`Are you sure you want to delete "${target?.name}"? This will fail if products still use this category.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
