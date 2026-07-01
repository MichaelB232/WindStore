"use client";

import { useEffect, useState } from "react";
import Container from "@/src/components/layout/Container";
import CartCard from "@/src/components/cart/CartCard";
import OrderCard from "@/src/components/cart/OrderCard";
import { CartItem } from "@/src/lib/producttype/ProductType";
import { getCartStockInfo } from "@/src/lib/cart/cartStock";
import {
  getCart,
  removeCartItem,
  clearCart,
} from "@/src/services/cart/cart.service";
import { useCartSelection } from "@/src/services/cart/context/CartSelectionContext";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/src/routes/routes";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { selectedIds, selectMany, deselectMany, isSelected } =
    useCartSelection();

  useEffect(() => {
    getCart()
      .then((data) => {
        setItems(data);
        // Default to selecting every item that's actually purchasable, so
        // the user doesn't have to manually check off a fresh cart.
        const selectableIds = data
          .filter((item) => !getCartStockInfo(item).isBlocked)
          .map((item) => item.id);
        selectMany(selectableIds);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = async (cartItemId: number) => {
    await removeCartItem(cartItemId);
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
    deselectMany([cartItemId]);
  };

  const handleClear = async () => {
    await clearCart();
    setItems([]);
    deselectMany(items.map((item) => item.id));
  };

  const selectableItems = items.filter(
    (item) => !getCartStockInfo(item).isBlocked,
  );
  const allSelectableChecked =
    selectableItems.length > 0 &&
    selectableItems.every((item) => isSelected(item.id));

  const handleToggleAll = () => {
    if (allSelectableChecked) {
      deselectMany(selectableItems.map((item) => item.id));
    } else {
      selectMany(selectableItems.map((item) => item.id));
    }
  };

  return (
    <main className="py-24 w-full">
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="font-bold font-display text-4xl">Your Cart</h1>
            <p className="text-sm font-sans text-muted-foreground mt-1">
              Review your selected items and configurations
            </p>
          </div>
          {items.length > 0 && (
            <div className="flex items-center gap-6">
              {selectableItems.length > 0 && (
                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={allSelectableChecked}
                    onChange={handleToggleAll}
                    className="size-4 shrink-0 rounded border-gray-300 accent-accent"
                  />
                  Select all
                </label>
              )}
              <button
                onClick={handleClear}
                className="text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32 text-muted-foreground">
            Loading cart…
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <ShoppingCart size={48} className="text-muted-foreground mb-4" />
            <h2 className="font-display font-bold text-2xl mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Find your perfect build in the shop.
            </p>
            <Link
              href={ROUTES.SHOP}
              className="px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors"
            >
              Browse Laptops
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8">
              {items.map((item) => (
                <CartCard key={item.id} item={item} onRemove={handleRemove} />
              ))}
            </div>
            <div className="col-span-4">
              <div className="sticky top-24">
                <OrderCard
                  items={items.filter((item) => selectedIds.has(item.id))}
                />
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
