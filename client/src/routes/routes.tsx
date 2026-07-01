export const ROUTES = {
  HOME: "/",
  CART: "/cart",
  SHOP: "/shop",
  LAPTOP: "/laptop",
  PROFILE: "/profile",
  PROFILE_ORDER_HISTORY: "/profile/order-history",
  WISHLIST: "/wishlist",
  LOGIN: "/login",
  REGISTER: "/register",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  ORDER_DETAIL: (publicId: string) => `/orders/${publicId}`,
};
