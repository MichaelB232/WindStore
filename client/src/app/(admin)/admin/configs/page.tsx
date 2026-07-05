"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Layers, Star } from "lucide-react";
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
  getAllProductsAdmin,
  getConfigsByProduct,
  createProductConfigAdmin,
  updateProductConfigAdmin,
  deleteProductConfigAdmin,
} from "@/src/services/admin/admin.service";
import {
  AdminProductConfig,
  AdminProductListItem,
  ProductConfigFormValues,
} from "@/src/lib/admin/AdminType";
import { formatPrice, getErrorMessage } from "@/src/utils/utils";

const EMPTY_FORM: Omit<ProductConfigFormValues, "productId"> = {
  configName: "",
  configType: "",
  priceModifier: "0",
  isDefault: false,
};

export default function AdminConfigsPage() {
  const [products, setProducts] = useState<AdminProductListItem[]>([]);
  const [productId, setProductId] = useState<string>("");
  const [configs, setConfigs] = useState<AdminProductConfig[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingConfigs, setLoadingConfigs] = useState(false);
  const [target, setTarget] = useState<AdminProductConfig | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProductConfig | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllProductsAdmin();
        setProducts(data);
        if (data.length > 0) setProductId(String(data[0].id));
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load products"));
      } finally {
        setLoadingProducts(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadConfigs = async (id: string) => {
      if (!id) return;
      setLoadingConfigs(true);
      try {
        const data = await getConfigsByProduct(Number(id));
        setConfigs(data);
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load configs"));
        setConfigs([]);
      } finally {
        setLoadingConfigs(false);
      }
    };
    if (productId) loadConfigs(productId);
  }, [productId]);

  const selectedProduct = useMemo(
    () => products.find((p) => String(p.id) === productId),
    [products, productId],
  );

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (config: AdminProductConfig) => {
    setEditing(config);
    setForm({
      configName: config.configName,
      configType: config.configType,
      priceModifier: config.priceModifier,
      isDefault: config.isDefault,
    });
    setFormOpen(true);
  };

  const loadConfigs = async (id: string) => {
    if (!id) return;
    setLoadingConfigs(true);
    try {
      const data = await getConfigsByProduct(Number(id));
      setConfigs(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to load configs"));
      setConfigs([]);
    } finally {
      setLoadingConfigs(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !form.configName || !form.configType) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const payload: ProductConfigFormValues = { ...form, productId };
      if (editing) {
        await updateProductConfigAdmin(editing.id, payload);
        toast.success("Config updated successfully");
      } else {
        await createProductConfigAdmin(payload);
        toast.success("Config added successfully");
      }
      setFormOpen(false);
      loadConfigs(productId);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save config"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!target) return;
    try {
      const message = await deleteProductConfigAdmin(target.id);
      toast.success(message);
      setConfigs((prev) => prev.filter((c) => c.id !== target.id));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete config"));
    }
  };

  return (
    <>
      <AdminTopbar
        title="Product Configs"
        description="Manage storage/RAM variants and price modifiers per product"
      />

      <div className="p-8">
        <PageHeader
          title="Select a product"
          action={
            <Button size="sm" onClick={openCreate} disabled={!productId}>
              <Plus className="size-4" /> Add config
            </Button>
          }
        />

        {loadingProducts ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-accent" />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No products yet"
            description="Add a product first."
          />
        ) : (
          <>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mb-6 h-9 w-full max-w-sm rounded-lg border border-input bg-surface px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.brand.name})
                </option>
              ))}
            </select>

            {loadingConfigs ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="size-6 animate-spin text-accent" />
              </div>
            ) : configs.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="No configs for this product"
                description={`Add storage/RAM variants for "${selectedProduct?.name}".`}
              />
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-alt text-left text-xs font-medium text-text-secondary">
                      <th className="px-4 py-3">Config Name</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Price Modifier</th>
                      <th className="px-4 py-3">Default</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {configs.map((config) => (
                      <tr key={config.id} className="hover:bg-surface-alt/50">
                        <td className="px-4 py-3 font-medium text-text-primary">
                          {config.configName}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {config.configType}
                        </td>
                        <td className="px-4 py-3 text-text-secondary">
                          {formatPrice(config.priceModifier)}
                        </td>
                        <td className="px-4 py-3">
                          {config.isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-accent-muted px-2.5 py-1 text-xs font-medium text-accent">
                              <Star className="size-3" /> Default
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => openEdit(config)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              className="text-danger hover:bg-danger/10"
                              onClick={() => setTarget(config)}
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
          </>
        )}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit config" : "Add config"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Config Name
              </label>
              <Input
                value={form.configName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, configName: e.target.value }))
                }
                placeholder="16GB / 1TB"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Config Type
              </label>
              <Input
                value={form.configType}
                onChange={(e) =>
                  setForm((f) => ({ ...f, configType: e.target.value }))
                }
                placeholder="storage"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Price Modifier (IDR)
              </label>
              <Input
                type="number"
                value={form.priceModifier}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priceModifier: e.target.value }))
                }
                placeholder="0"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-text-primary">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isDefault: e.target.checked }))
                }
                className="size-4 rounded border-border accent-accent"
              />
              Set as default configuration
            </label>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {editing ? "Save changes" : "Add config"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Delete config"
        description={`Are you sure you want to delete "${target?.configName}"?`}
        onConfirm={handleDelete}
      />
    </>
  );
}
