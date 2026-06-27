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

//Detail page types 

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductConfig {
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