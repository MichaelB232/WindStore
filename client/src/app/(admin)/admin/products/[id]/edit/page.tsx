"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Info } from "lucide-react";
import AdminTopbar from "@/src/components/admin/AdminTopbar";
import ProductForm from "@/src/components/admin/ProductForm";
import ProductFeaturesManager from "@/src/components/admin/ProductFeaturesManager";
import ProductImagesManager from "@/src/components/admin/ProductImagesManager";
import {
  getProductEditData,
  getProductGalleryData,
} from "@/src/services/admin/admin.service";
import {
  AdminBrand,
  AdminCategory,
  AdminProductDetail,
  AdminProductFeature,
  AdminProductImage,
} from "@/src/lib/admin/AdminType";
import { getErrorMessage } from "@/src/utils/utils";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<AdminProductDetail | null>(null);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [features, setFeatures] = useState<AdminProductFeature[]>([]);
  const [images, setImages] = useState<AdminProductImage[]>([]);
  const [galleryAvailable, setGalleryAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProductEditData(Number(id));
        if (!data.product) {
          setError("Product not found");
          return;
        }
        setProduct(data.product);
        setBrands(data.brands);
        setCategories(data.categories);

        const gallery = await getProductGalleryData(data.product.slug);
        if (gallery) {
          setFeatures(gallery.productFeatures ?? []);
          setImages(gallery.productImages ?? []);
        } else {
          setGalleryAvailable(false);
        }
      } catch (err) {
        const message = getErrorMessage(err, "Failed to load product");
        toast.error(message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <>
      <AdminTopbar title="Edit Product" description="Update product details" />
      <div className="mx-auto max-w-3xl space-y-6 p-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-accent" />
          </div>
        ) : error || !product ? (
          <p className="text-center text-sm text-danger">
            {error ?? "Product not found"}
          </p>
        ) : (
          <>
            <ProductForm
              brands={brands}
              categories={categories}
              product={product}
            />

            {!galleryAvailable && (
              <div className="flex items-start gap-2 rounded-xl border border-border bg-surface-alt p-4 text-sm text-text-secondary">
                <Info className="mt-0.5 size-4 shrink-0 text-accent" />
                <p>
                  Features and gallery images can only be managed once this
                  product is active. Activate it above, save, then come back to
                  this page.
                </p>
              </div>
            )}

            {galleryAvailable && (
              <>
                <ProductFeaturesManager
                  productId={product.id}
                  initialFeatures={features}
                />
                <ProductImagesManager
                  productId={product.id}
                  initialImages={images}
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
