import { Specs } from "@/src/lib/producttype/ProductType";

// ─── Shared ────────────────────────────────────────────────

export interface AdminBrand {
  id: number;
  name: string;
  description: string;
}

export interface AdminCategory {
  id: number;
  name: string;
}

// ─── Products ──────────────────────────────────────────────

export interface AdminProductListItem {
  id: number;
  name: string;
  slug: string;
  motto: string;
  description: string;
  basePrice: string;
  badge: string;
  specs: Specs;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  brandId: number;
  categoryId: number;
  brand: { name: string };
  category: { name: string };
  _count: {
    reviews: number;
    orderItems: number;
  };
}

export interface AdminProductDetail {
  id: number;
  name: string;
  slug: string;
  motto: string;
  description: string;
  basePrice: string;
  badge: string;
  specs: Specs;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  brandId: number;
  categoryId: number;
}

export interface AdminProductFormData {
  brands: AdminBrand[];
  categories: AdminCategory[];
}

export interface AdminProductEditData {
  product: AdminProductDetail;
  brands: AdminBrand[];
  categories: AdminCategory[];
}

export interface ProductFormValues {
  name: string;
  brandId: string;
  categoryId: string;
  slug: string;
  motto: string;
  description: string;
  basePrice: string;
  badge: string;
  specs: Specs;
  stock: string;
  isActive: boolean;
  image: File | null;
}

// ─── Product Configs ───────────────────────────────────────

export interface AdminProductConfig {
  id: number;
  productId: number;
  configName: string;
  configType: string;
  priceModifier: string;
  isDefault: boolean;
  displayOrder: number;
}

export interface ProductConfigFormValues {
  productId: string;
  configName: string;
  configType: string;
  priceModifier: string;
  isDefault: boolean;
}

// ─── Product Features ──────────────────────────────────────

export interface AdminProductFeature {
  id: number;
  productId: number;
  title: string;
  description: string;
  displayOrder: number;
}

export interface ProductFeatureFormValues {
  productId: string;
  title: string;
  description: string;
}

// ─── Product Images ────────────────────────────────────────

export interface AdminProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

// ─── Users ─────────────────────────────────────────────────

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

// ─── Reviews ───────────────────────────────────────────────

export interface AdminReview {
  id: number;
  userId: number;
  productId: number;
  rating: string;
  comment: string | null;
  createdAt: string;
  user?: { username: string };
  product?: { name: string };
}
