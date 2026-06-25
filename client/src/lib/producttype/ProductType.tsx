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
}

export interface Brands {
  name: string;
  description: string;
  id: number;
}

export interface CatalogClientProps {
  brands: Brands[];
  products: Product[];
}