export interface Specs {
  os: string;
  gpu: string;
  ram: string;
  battery: string;
  display: string;
  storage: string;
  processor: string;
}

export interface Category {
  name: string;
}

export interface Brand {
  name: string;
}

export interface ProductImage {
  imageUrl: string;
}

export interface DefaultConfig {
  id: number;
  configName: string;
  configType: string;
  priceModifier: string;
}
export interface Product {
  id: number;
  name: string;
  brandId: number;
  brand: Brand;
  slug: string;
  categoryId: number;
  motto: string;
  description: string;
  basePrice: string;
  badge: string;
  specs: Specs;
  stock: number;
  isActive: boolean;
  imageUrl: string;
  category: Category;
  productImages: ProductImage[];
  defaultConfig: DefaultConfig | null;
}

export interface Brands {
  name: string;
  description: string;
  id: number;
}

export interface ShopSearchParams {
  category?: string;
  brand?: string;
  processor?: string;
  search?: string;
  priceMin?: string;
  priceMax?: string;
  sortBy?: string;
}

export interface CatalogClientProps {
  brands: Brands[];
  products: Product[];
  processors: string[];
  categories: string[];
  initialFilters: ShopSearchParams;
}

// Detail page types
export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductConfig {
  id: number;
  configName: string;
  configType: string;
  priceModifier: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  motto: string;
  description: string;
  basePrice: string;
  badge: string | null;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  specs: Specs;
  brand: Brand;
  productImages: ProductImage[];
  productFeatures: ProductFeature[];
  productConfigs: ProductConfig[];
}

// Cart types
export interface CartProduct {
  id: number;
  name: string;
  slug: string;
  basePrice: string;
  imageUrl: string;
  specs: Specs;
  brand: { name: string };
  category: { name: string };
}

export interface CartProductConfig {
  id: number;
  configName: string;
  configType: string;
  priceModifier: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  configId: number | null;
  quantity: number;
  product: CartProduct;
  productConfig: CartProductConfig | null;
}

// Wishlist types
export interface WishlistProduct {
  id: number;
  name: string;
  slug: string;
  basePrice: string;
  imageUrl: string;
  badge: string | null;
  specs: Specs;
  brand: { name: string };
  category: { name: string };
}

export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  addedAt: string;
  product: WishlistProduct;
}
