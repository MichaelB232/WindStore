"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/src/components/ui/shadcn/button";
import { Input } from "@/src/components/ui/shadcn/input";
import { ADMIN_ROUTES } from "@/src/routes/adminRoutes";
import { getErrorMessage } from "@/src/utils/utils";
import {
  AdminBrand,
  AdminCategory,
  AdminProductDetail,
  ProductFormValues,
} from "@/src/lib/admin/AdminType";
import {
  createProductAdmin,
  updateProductAdmin,
} from "@/src/services/admin/admin.service";
import Image from "next/image";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({
  brands,
  categories,
  product,
}: {
  brands: AdminBrand[];
  categories: AdminCategory[];
  product?: AdminProductDetail;
}) {
  const router = useRouter();
  const isEdit = !!product;
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    product?.imageUrl ?? null,
  );
  const [slugTouched, setSlugTouched] = useState(isEdit);

  const [values, setValues] = useState<ProductFormValues>({
    name: product?.name ?? "",
    brandId: product ? String(product.brandId) : "",
    categoryId: product ? String(product.categoryId) : "",
    slug: product?.slug ?? "",
    motto: product?.motto ?? "",
    description: product?.description ?? "",
    basePrice: product?.basePrice ?? "",
    badge: product?.badge ?? "",
    specs: product?.specs ?? {
      os: "",
      gpu: "",
      ram: "",
      battery: "",
      display: "",
      storage: "",
      processor: "",
    },
    stock: product ? String(product.stock) : "0",
    isActive: product?.isActive ?? false,
    image: null,
  });

  const update = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const updateSpec = (key: keyof ProductFormValues["specs"], value: string) => {
    setValues((prev) => ({ ...prev, specs: { ...prev.specs, [key]: value } }));
  };

  const handleNameChange = (name: string) => {
    update("name", name);
    if (!slugTouched) {
      update("slug", slugify(name));
    }
  };

  const handleImageChange = (file: File | null) => {
    update("image", file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    if (
      !values.name ||
      !values.brandId ||
      !values.categoryId ||
      !values.slug ||
      !values.motto ||
      !values.description ||
      !values.basePrice ||
      !values.badge
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }
    if (!isEdit && !values.image) {
      toast.error("Please upload a product image");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEdit && product) {
        await updateProductAdmin(product.id, values);
        toast.success("Product updated successfully");
      } else {
        await createProductAdmin(values);
        toast.success("Product created successfully");
      }
      router.push(ADMIN_ROUTES.PRODUCTS);
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save product"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 font-display font-bold text-text-primary">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Product Name" required>
            <Input
              value={values.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="ASUS ROG Strix G16"
            />
          </Field>
          <Field label="Slug" required>
            <Input
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                update("slug", e.target.value);
              }}
              placeholder="asus-rog-strix-g16"
            />
          </Field>
          <Field label="Brand" required>
            <select
              value={values.brandId}
              onChange={(e) => update("brandId", e.target.value)}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Select brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category" required>
            <select
              value={values.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Motto" required className="sm:col-span-2">
            <Input
              value={values.motto}
              onChange={(e) => update("motto", e.target.value)}
              placeholder="Dominate Every Game"
            />
          </Field>
          <Field label="Description" required className="sm:col-span-2">
            <textarea
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              placeholder="High performance gaming laptop"
            />
          </Field>
          <Field label="Base Price (IDR)" required>
            <Input
              type="number"
              min={0}
              value={values.basePrice}
              onChange={(e) => update("basePrice", e.target.value)}
              placeholder="25000000"
            />
          </Field>
          <Field label="Badge" required>
            <Input
              value={values.badge}
              onChange={(e) => update("badge", e.target.value)}
              placeholder="New"
            />
          </Field>
          <Field label="Stock" required>
            <Input
              type="number"
              min={0}
              value={values.stock}
              onChange={(e) => update("stock", e.target.value)}
            />
          </Field>
          <Field label="Status">
            <label className="flex h-8 items-center gap-2 text-sm text-text-primary">
              <input
                type="checkbox"
                checked={values.isActive}
                onChange={(e) => update("isActive", e.target.checked)}
                className="size-4 rounded border-border accent-accent"
              />
              Active (visible on storefront)
            </label>
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 font-display font-bold text-text-primary">Specs</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Processor">
            <Input
              value={values.specs.processor}
              onChange={(e) => updateSpec("processor", e.target.value)}
              placeholder="Intel Core i9-13980HX"
            />
          </Field>
          <Field label="GPU">
            <Input
              value={values.specs.gpu}
              onChange={(e) => updateSpec("gpu", e.target.value)}
              placeholder="RTX 4070 8GB"
            />
          </Field>
          <Field label="RAM">
            <Input
              value={values.specs.ram}
              onChange={(e) => updateSpec("ram", e.target.value)}
              placeholder="16GB DDR5"
            />
          </Field>
          <Field label="Storage">
            <Input
              value={values.specs.storage}
              onChange={(e) => updateSpec("storage", e.target.value)}
              placeholder="1TB SSD"
            />
          </Field>
          <Field label="Display">
            <Input
              value={values.specs.display}
              onChange={(e) => updateSpec("display", e.target.value)}
              placeholder='16" QHD 240Hz'
            />
          </Field>
          <Field label="Battery">
            <Input
              value={values.specs.battery}
              onChange={(e) => updateSpec("battery", e.target.value)}
              placeholder="90Whr"
            />
          </Field>
          <Field label="OS" className="sm:col-span-2">
            <Input
              value={values.specs.os}
              onChange={(e) => updateSpec("os", e.target.value)}
              placeholder="Windows 11 Home"
            />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
        <h3 className="mb-4 font-display font-bold text-text-primary">
          Product Image {!isEdit && <span className="text-danger">*</span>}
        </h3>
        <div className="flex items-center gap-4">
          {preview && (
            <Image
              src={preview}
              alt="Preview"
              className="size-20 rounded-lg border border-border object-cover"
              width={200}
              height={200}
            ></Image>
          )}
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border-strong px-4 py-3 text-sm text-text-secondary hover:bg-surface-alt">
            <UploadCloud className="size-4" />
            {values.image ? values.image.name : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        {isEdit && (
          <p className="mt-2 text-xs text-text-secondary">
            Leave empty to keep the current image.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(ADMIN_ROUTES.PRODUCTS)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-text-primary">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
    </div>
  );
}
