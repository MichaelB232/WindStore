"use client";

import { useEffect, useState } from "react";
import Container from "@/src/components/layout/Container";
import CartCard from "@/src/components/cart/CartCard";
import OrderCard from "@/src/components/cart/OrderCard";
import { CartItem } from "@/src/lib/producttype/ProductType";
import {
  getCart,
  removeCartItem,
  clearCart,
} from "@/src/services/cart/cart.service";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/src/routes/routes";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCart()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (cartItemId: number) => {
    await removeCartItem(cartItemId);
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleClear = async () => {
    await clearCart();
    setItems([]);
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
            <button
              onClick={handleClear}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              Clear all
            </button>
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
                <OrderCard items={items} />
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
