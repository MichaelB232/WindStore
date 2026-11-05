import { Lock, Loader2, ShieldCheck } from "lucide-react";
import { CartItem } from "@/src/lib/producttype/ProductType";
import { formatPrice } from "@/src/utils/utils";

type CheckoutSummaryProps = {
  items: CartItem[];
  isProcessing: boolean;
  paymentReady: boolean;
  hasAddress?: boolean;
  onPay: () => void;
};

export default function CheckoutSummary({
  items,
  isProcessing,
  paymentReady,
  hasAddress = true,
  onPay,
}: CheckoutSummaryProps) {
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    return sum + parseFloat(item.product.basePrice) * item.quantity;
  }, 0);

  const upgradesTotal = items.reduce((sum, item) => {
    if (!item.productConfig) return sum;
    return sum + parseFloat(item.productConfig.priceModifier) * item.quantity;
  }, 0);

  const total = subtotal + upgradesTotal;
  const disabled = isProcessing || !paymentReady || !hasAddress;

  return (
    <aside className="rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-8 shadow-card">
      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold">Payment Summary</h2>

      <div className="mt-6 sm:mt-10 space-y-4 sm:space-y-6">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground">
            Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"})
          </span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {upgradesTotal > 0 && (
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">Upgrades</span>
            <span className="font-medium">{formatPrice(upgradesTotal)}</span>
          </div>
        )}

        <div className="flex justify-between text-xs sm:text-sm text-accent">
          <span>Shipping</span>
          <span className="font-semibold">Free</span>
        </div>
      </div>

      <div className="my-5 sm:my-6 border-t border-border" />

      <div className="flex items-end justify-between">
        <span className="text-lg sm:text-2xl font-medium self-center">Total</span>
        <div className="text-right">
          <p className="text-2xl sm:text-3xl font-display text-accent font-bold">
            {formatPrice(total)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Includes estimated taxes
          </p>
        </div>
      </div>

      <button
        onClick={onPay}
        disabled={disabled}
        className="mt-6 sm:mt-8 flex w-full items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-accent py-3.5 sm:py-5 font-semibold text-white transition-all duration-200 hover:bg-accent-hover hover:shadow-card-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base"
      >
        {isProcessing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Processing…
          </>
        ) : !hasAddress ? (
          "Select a shipping address"
        ) : !paymentReady ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Preparing secure payment…
          </>
        ) : (
          <>
            <ShieldCheck size={18} />
            Pay Now
          </>
        )}
      </button>

      <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <Lock size={14} />
        <span>Secured by Midtrans</span>
      </div>
    </aside>
  );
}
