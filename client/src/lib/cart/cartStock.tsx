import { CartItem } from "@/src/lib/producttype/ProductType";

export type CartStockStatus = "ok" | "out_of_stock" | "insufficient_stock";

export type CartStockInfo = {
  status: CartStockStatus;
  availableStock: number;
  isBlocked: boolean;
};

export function getCartStockInfo(item: CartItem): CartStockInfo {
  const availableStock = item.product.stock;

  if (availableStock <= 0) {
    return { status: "out_of_stock", availableStock, isBlocked: true };
  }

  if (item.quantity > availableStock) {
    return { status: "insufficient_stock", availableStock, isBlocked: true };
  }

  return { status: "ok", availableStock, isBlocked: false };
}
