import { Package, ArrowRight, Lock } from "lucide-react";

export default function OrderCart() {
  return (
    <aside className="rounded-3xl bg-white p-8 shadow-card z-100">
      {/* Title */}
      <h2 className="font-display text-4xl font-bold">Order Summary</h2>

      {/* Breakdown */}
      <div className="mt-10 space-y-6">
        <div className="flex justify-between">
          <span>Subtotal (Base)</span>
          <span>$1,299.00</span>
        </div>

        <div className="flex justify-between">
          <span>Upgrades</span>
          <span>$150.00</span>
        </div>

        <div className="flex justify-between">
          <span>Accessories</span>
          <span>$89.00</span>
        </div>

        <div className="flex justify-between text-accent">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-3 border-t border-border" />

      {/* Total */}
      <div className="flex items-end justify-between">
        <span className="text-2xl font-medium self-center">Total</span>

        <div className="text-right">
          <p className="text-3xl font-display text-accent">$1,538.00</p>

          <p className="mt-2 text-sm text-muted-foreground">
            Includes estimated taxes
          </p>
        </div>
      </div>

      {/* Stock */}
      <div className="mt-8 flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
        <Package size={18} className="text-accent" />

        <span>In Stock - Ready to Ship</span>
      </div>

      {/* Checkout */}
      <button className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-accent py-5 font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-card-hover">
        Proceed to Checkout
        <ArrowRight size={20} />
      </button>

      {/* Secure Checkout */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Lock size={14} />

        <span>Secure Checkout</span>
      </div>
    </aside>
  );
}
