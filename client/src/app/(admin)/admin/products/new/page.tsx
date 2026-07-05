"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import AdminTopbar from "@/src/components/admin/AdminTopbar";
import ProductForm from "@/src/components/admin/ProductForm";
import { getProductCreateFormData } from "@/src/services/admin/admin.service";
import { AdminBrand, AdminCategory } from "@/src/lib/admin/AdminType";
import { getErrorMessage } from "@/src/utils/utils";

export default function NewProductPage() {
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProductCreateFormData();
        console.log(data.brands);
        setBrands(data.brands);
        setCategories(data.categories);
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load form data"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <AdminTopbar
        title="Add Product"
        description="Create a new product listing"
      />
      <div className="mx-auto max-w-3xl p-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-accent" />
          </div>
        ) : (
          <ProductForm brands={brands} categories={categories} />
        )}
      </div>
    </>
  );
}
