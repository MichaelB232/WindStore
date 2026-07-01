"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Container from "@/src/components/layout/Container";
import CustomerInfoCard from "@/src/components/checkout/CustomerInfoCard";
import CheckoutItemsList from "@/src/components/checkout/CheckoutItemsList";
import CheckoutSummary from "@/src/components/checkout/CheckoutSummary";
import { CartItem } from "@/src/lib/producttype/ProductType";
import { getCartStockInfo } from "@/src/lib/cart/cartStock";
import { getCart, removeCartItem } from "@/src/services/cart/cart.service";
import { createCheckout } from "@/src/services/payment/payment.service";
import { useMidtransSnap } from "@/src/hooks/useMidtransSnap";
import { useCartSelection } from "@/src/services/cart/context/CartSelectionContext";
import { ROUTES } from "@/src/routes/routes";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const router = useRouter();
  const { isReady, pay } = useMidtransSnap();
  const { selectedIds, deselectMany } = useCartSelection();

  useEffect(() => {
    getCart()
      .then(setCart)
      .finally(() => setLoading(false));
  }, []);

  const items = useMemo(() => {
    const hasStoredSelection = cart.some((item) => selectedIds.has(item.id));
    if (hasStoredSelection) {
      return cart.filter((item) => selectedIds.has(item.id));
    }
    return cart.filter((item) => !getCartStockInfo(item).isBlocked);
  }, [cart, selectedIds]);

  const handlePay = async () => {
    if (isProcessing || items.length === 0) return;

    const hasMissingConfig = items.some((item) => !item.configId);
    if (hasMissingConfig) {
      toast.error(
        "Some items are missing a configuration. Please remove and re-add them from the shop.",
      );
      return;
    }

    setIsProcessing(true);

    const result = await createCheckout(
      items.map((item) => ({
        productId: item.productId,
        configId: item.configId as number,
        quantity: item.quantity,
      })),
    );

    if (!result.success || !result.data) {
      toast.error(
        result.message ?? "Could not start checkout. Please try again.",
      );
      setIsProcessing(false);
      return;
    }

    const { publicId, token } = result.data;
    const checkedOutIds = items.map((item) => item.id);

    await Promise.all(checkedOutIds.map((id) => removeCartItem(id)));
    deselectMany(checkedOutIds);

    const goToOrderStatus = () => router.push(ROUTES.ORDER_DETAIL(publicId));

    pay(token, {
      onSuccess: goToOrderStatus,
      onPending: goToOrderStatus,
      onClose: goToOrderStatus,
      onError: () => {
        toast.error("Payment failed. You can check your order status below.");
        goToOrderStatus();
      },
    });
  };

  return (
    <main className="py-24 w-full">
      <Container>
        <Link
          href={ROUTES.CART}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>

        <div className="mb-10">
          <h1 className="font-bold font-display text-4xl">Checkout</h1>
          <p className="text-sm font-sans text-muted-foreground mt-1">
            Review your order and complete your payment
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32 text-muted-foreground">
            Loading your order…
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <ShoppingBag size={48} className="text-muted-foreground mb-4" />
            <h2 className="font-display font-bold text-2xl mb-2">
              Nothing to check out
            </h2>
            <p className="text-muted-foreground mb-6">
              {cart.length === 0
                ? "Your cart is empty."
                : "No items are selected for checkout."}
            </p>
            <Link
              href={cart.length === 0 ? ROUTES.SHOP : ROUTES.CART}
              className="px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors"
            >
              {cart.length === 0 ? "Browse Laptops" : "Back to Cart"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-6">
              <CustomerInfoCard />
              <CheckoutItemsList items={items} />
            </div>
            <div className="col-span-4">
              <div className="sticky top-24">
                <CheckoutSummary
                  items={items}
                  isProcessing={isProcessing}
                  paymentReady={isReady}
                  onPay={handlePay}
                />
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
