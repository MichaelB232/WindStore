export const ROUTES = {
  HOME: "/",
  CART: "/cart",
  SHOP: "/shop",
  LAPTOP: "/laptop",
  PROFILE: "/profile",
  WISHLIST: "/wishlist",
  LOGIN: "/login",
  REGISTER: "/register",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  ORDER_DETAIL: (publicId: string | string) => `/orders/${publicId}`,
};
