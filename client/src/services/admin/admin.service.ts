import {
  AdminBrand,
  AdminCategory,
  AdminProductConfig,
  AdminProductEditData,
  AdminProductFeature,
  AdminProductFormData,
  AdminProductListItem,
  AdminReview,
  AdminUser,
  ProductConfigFormValues,
  ProductFeatureFormValues,
  ProductFormValues,
} from "@/src/lib/admin/AdminType";

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/admin`;

async function handle<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.message ?? "Request failed");
  }
  return json.data as T;
}

async function handleMessage(res: Response): Promise<string> {
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.message ?? "Request failed");
  }
  return json.message as string;
}

function buildProductFormData(values: ProductFormValues): FormData {
  const fd = new FormData();
  fd.append("name", values.name);
  fd.append("brandId", values.brandId);
  fd.append("categoryId", values.categoryId);
  fd.append("slug", values.slug);
  fd.append("motto", values.motto);
  fd.append("description", values.description);
  fd.append("basePrice", values.basePrice);
  fd.append("badge", values.badge);
  fd.append("specs", JSON.stringify(values.specs));
  fd.append("stock", values.stock);
  fd.append("isActive", String(values.isActive));
  if (values.image) fd.append("image", values.image);
  return fd;
}

// ─── Products ──────────────────────────────────────────────

export async function getAllProductsAdmin() {
  const res = await fetch(`${BASE}/products`, {
    credentials: "include",
    cache: "no-store",
  });
  return handle<AdminProductListItem[]>(res);
}

export async function getProductCreateFormData() {
  const res = await fetch(`${BASE}/products/create`, {
    credentials: "include",
    cache: "no-store",
  });
  return handle<AdminProductFormData>(res);
}

export async function getProductEditData(id: number) {
  const res = await fetch(`${BASE}/products/${id}/edit`, {
    credentials: "include",
    cache: "no-store",
  });
  return handle<AdminProductEditData>(res);
}

// Note: there's no dedicated endpoint to fetch a single product's features
// and images by id/slug for the admin panel. The only route that returns
// them is the public product detail route, which only returns active
// products. For inactive (draft) products this will return null, and the
// features/images managers fall back to an empty list until the product
// is activated.
export async function getProductGalleryData(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`,
    { credentials: "include", cache: "no-store" },
  );
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  return json?.data ?? null;
}

export async function createProductAdmin(values: ProductFormValues) {
  const res = await fetch(`${BASE}/products`, {
    method: "POST",
    credentials: "include",
    body: buildProductFormData(values),
  });
  return handle(res);
}

export async function updateProductAdmin(
  id: number,
  values: ProductFormValues,
) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: "PUT",
    credentials: "include",
    body: buildProductFormData(values),
  });
  return handle(res);
}

export async function deleteProductAdmin(id: number) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleMessage(res);
}

// ─── Brands ────────────────────────────────────────────────

export async function getAllBrandsAdmin() {
  const res = await fetch(`${BASE}/brands`, {
    credentials: "include",
    cache: "no-store",
  });
  return handle<AdminBrand[]>(res);
}

export async function createBrandAdmin(data: {
  name: string;
  description: string;
}) {
  const res = await fetch(`${BASE}/brands`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleMessage(res);
}

export async function updateBrandAdmin(
  id: number,
  data: { name: string; description: string },
) {
  const res = await fetch(`${BASE}/brands/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleMessage(res);
}

export async function deleteBrandAdmin(id: number) {
  const res = await fetch(`${BASE}/brands/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleMessage(res);
}

// ─── Categories ────────────────────────────────────────────

export async function getAllCategoriesAdmin() {
  const res = await fetch(`${BASE}/categories`, {
    credentials: "include",
    cache: "no-store",
  });
  return handle<AdminCategory[]>(res);
}

export async function createCategoryAdmin(name: string) {
  const res = await fetch(`${BASE}/categories`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return handle<AdminCategory>(res);
}

export async function updateCategoryAdmin(id: number, name: string) {
  const res = await fetch(`${BASE}/categories/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return handle<AdminCategory>(res);
}

export async function deleteCategoryAdmin(id: number) {
  const res = await fetch(`${BASE}/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleMessage(res);
}

// ─── Product Configs ───────────────────────────────────────
// Note: there is no admin "list all configs" endpoint. Configs, features,
// and images are all scoped per-product, fetched via their public routes.

export async function getConfigsByProduct(productId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/configs/${productId}`,
    { credentials: "include", cache: "no-store" },
  );
  return handle<AdminProductConfig[]>(res);
}

export async function createProductConfigAdmin(
  values: ProductConfigFormValues,
) {
  const res = await fetch(`${BASE}/configs`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: Number(values.productId),
      configName: values.configName,
      configType: values.configType,
      priceModifier: values.priceModifier,
      isDefault: values.isDefault,
    }),
  });
  return handle<AdminProductConfig>(res);
}

export async function updateProductConfigAdmin(
  id: number,
  values: ProductConfigFormValues,
) {
  const res = await fetch(`${BASE}/configs/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: Number(values.productId),
      configName: values.configName,
      configType: values.configType,
      priceModifier: values.priceModifier,
      isDefault: values.isDefault,
    }),
  });
  return handle<AdminProductConfig>(res);
}

export async function deleteProductConfigAdmin(id: number) {
  const res = await fetch(`${BASE}/configs/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleMessage(res);
}

// ─── Product Features ──────────────────────────────────────

export async function createProductFeatureAdmin(
  values: ProductFeatureFormValues,
) {
  const res = await fetch(`${BASE}/features`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: Number(values.productId),
      title: values.title,
      description: values.description,
    }),
  });
  return handle<AdminProductFeature>(res);
}

export async function updateProductFeatureAdmin(
  id: number,
  values: Pick<ProductFeatureFormValues, "title" | "description">,
) {
  const res = await fetch(`${BASE}/features/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  return handle<AdminProductFeature>(res);
}

export async function deleteProductFeatureAdmin(id: number) {
  const res = await fetch(`${BASE}/features/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleMessage(res);
}

// ─── Product Images ────────────────────────────────────────

export async function addProductImageAdmin(
  productId: number,
  image: File,
  isPrimary: boolean,
) {
  const fd = new FormData();
  fd.append("productId", String(productId));
  fd.append("isPrimary", String(isPrimary));
  fd.append("image", image);
  const res = await fetch(`${BASE}/images`, {
    method: "POST",
    credentials: "include",
    body: fd,
  });
  return handle(res);
}

export async function updateProductImageAdmin(
  id: number,
  productId: number,
  isPrimary: boolean,
) {
  const res = await fetch(`${BASE}/images/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, isPrimary }),
  });
  return handle(res);
}

export async function deleteProductImageAdmin(id: number) {
  const res = await fetch(`${BASE}/images/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleMessage(res);
}

// ─── Users ─────────────────────────────────────────────────

export async function getAllUsersAdmin() {
  const res = await fetch(`${BASE}/users`, {
    credentials: "include",
    cache: "no-store",
  });
  return handle<AdminUser[]>(res);
}

export async function deleteUserAdmin(id: number) {
  const res = await fetch(`${BASE}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleMessage(res);
}

// ─── Reviews ───────────────────────────────────────────────
// Note: there is no admin "list all reviews" endpoint on the server.
// Reviews are fetched per-product via the public reviews route
// (capped at 5 most recent by the API) and deleted via the admin route.

export async function getReviewsByProductAdmin(productId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${productId}`,
    { credentials: "include", cache: "no-store" },
  );
  return handle<AdminReview[]>(res);
}

export async function deleteReviewAdmin(id: number) {
  const res = await fetch(`${BASE}/reviews/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleMessage(res);
}

export type { AdminReview };
