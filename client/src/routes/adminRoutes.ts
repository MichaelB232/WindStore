export const ADMIN_ROUTES = {
  DASHBOARD: "/admin",
  PRODUCTS: "/admin/products",
  PRODUCT_NEW: "/admin/products/new",
  PRODUCT_EDIT: (id: number | string) => `/admin/products/${id}/edit`,
  BRANDS: "/admin/brands",
  CATEGORIES: "/admin/categories",
  CONFIGS: "/admin/configs",
  USERS: "/admin/users",
  REVIEWS: "/admin/reviews",
};
