"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Building2 } from "lucide-react";
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
  getAllBrandsAdmin,
  createBrandAdmin,
  updateBrandAdmin,
  deleteBrandAdmin,
} from "@/src/services/admin/admin.service";
import { AdminBrand } from "@/src/lib/admin/AdminType";
import { getErrorMessage } from "@/src/utils/utils";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<AdminBrand | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBrand | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllBrandsAdmin();
        setBrands(data);
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load brands"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setFormOpen(true);
  };

  const openEdit = (brand: AdminBrand) => {
    setEditing(brand);
    setName(brand.name);
    setDescription(brand.description);
    setFormOpen(true);
  };

  const load = async () => {
    try {
      const data = await getAllBrandsAdmin();
      setBrands(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load brands"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      toast.error("Name and description are required");
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        await updateBrandAdmin(editing.id, { name, description });
        toast.success("Brand updated successfully");
      } else {
        await createBrandAdmin({ name, description });
        toast.success("Brand added successfully");
      }
      setFormOpen(false);

      load();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save brand"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!target) return;
    try {
      const message = await deleteBrandAdmin(target.id);
      toast.success(message);
      setBrands((prev) => prev.filter((b) => b.id !== target.id));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete brand"));
    }
  };

  return (
    <>
      <AdminTopbar title="Brands" description="Manage laptop brands" />

      <div className="p-8">
        <PageHeader
          title={`${brands.length} brand${brands.length === 1 ? "" : "s"}`}
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" /> Add brand
            </Button>
          }
        />

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-accent" />
          </div>
        ) : brands.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No brands yet"
            description="Add a brand to start listing products under it."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="rounded-xl border border-border bg-surface p-5 shadow-card"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-display font-bold text-text-primary">
                    {brand.name}
                  </h3>
                  <div className="flex gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => openEdit(brand)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-danger hover:bg-danger/10"
                      onClick={() => setTarget(brand)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="mt-1.5 text-sm text-text-secondary">
                  {brand.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit brand" : "Add brand"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ASUS"
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
                placeholder="Global leader in gaming laptops"
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
                {editing ? "Save changes" : "Add brand"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Delete brand"
        description={`Are you sure you want to delete "${target?.name}"? Products under this brand may be affected.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
