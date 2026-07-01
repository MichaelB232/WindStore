import Link from "next/link";
import { Package, ArrowRight, Lock } from "lucide-react";
import { CartItem } from "@/src/lib/producttype/ProductType";
import { formatPrice } from "@/src/utils/utils";
import { ROUTES } from "@/src/routes/routes";

type OrderCardProps = {
  items: CartItem[];
};

export default function OrderCard({ items }: OrderCardProps) {
  const hasSelection = items.length > 0;

  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    return sum + parseFloat(item.product.basePrice) * item.quantity;
  }, 0);

  const upgradesTotal = items.reduce((sum, item) => {
    if (!item.productConfig) return sum;
    return sum + parseFloat(item.productConfig.priceModifier) * item.quantity;
  }, 0);

  const total = subtotal + upgradesTotal;

  return (
    <aside className="rounded-3xl bg-white p-8 shadow-card">
      <h2 className="font-display text-4xl font-bold">Order Summary</h2>

      <div className="mt-10 space-y-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"} selected)
          </span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {upgradesTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Upgrades</span>
            <span className="font-medium">{formatPrice(upgradesTotal)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm text-accent">
          <span>Shipping</span>
          <span className="font-semibold">Free</span>
        </div>
      </div>

      <div className="my-6 border-t border-border" />

      <div className="flex items-end justify-between">
        <span className="text-2xl font-medium self-center">Total</span>
        <div className="text-right">
          <p className="text-3xl font-display text-accent">
            {formatPrice(total)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Includes estimated taxes
          </p>
        </div>
      </div>

      {hasSelection ? (
        <div className="mt-8 flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
          <Package size={18} className="text-accent" />
          <span className="text-sm">In Stock</span>
        </div>
      ) : (
        <div className="mt-8 flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
          <Package size={18} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Select at least one item to checkout
          </span>
        </div>
      )}

      {hasSelection ? (
        <Link
          href={ROUTES.CHECKOUT}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-accent py-5 font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-card-hover cursor-pointer"
        >
          Proceed to Checkout
          <ArrowRight size={20} />
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-accent py-5 font-semibold text-white opacity-50 cursor-not-allowed"
        >
          Proceed to Checkout
          <ArrowRight size={20} />
        </button>
      )}

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Lock size={14} />
        <span>Secure Checkout</span>
      </div>
    </aside>
  );
}
