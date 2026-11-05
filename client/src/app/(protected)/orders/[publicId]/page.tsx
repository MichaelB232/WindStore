"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import Container from "@/src/components/layout/Container";
import OrderStatusBanner from "@/src/components/order/OrderStatusBanner";
import OrderItemsSummary from "@/src/components/order/OrderItemsSummary";
import OrderAddressCard from "@/src/components/order/OrderAddressCard";
import PaymentDetailsCard from "@/src/components/order/PaymentDetailsCard";
import { Order } from "@/src/lib/order/OrderType";
import { getOrderStatus } from "@/src/services/order/order.service";
import { getPaymentToken } from "@/src/services/payment/payment.service";
import { useMidtransSnap } from "@/src/hooks/useMidtransSnap";
import { ROUTES } from "@/src/routes/routes";

const POLL_INTERVAL_MS = 4000;
const MAX_POLL_ATTEMPTS = 15;

export default function OrderStatusPage() {
  const { publicId } = useParams() as { publicId: string };

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [payingNow, setPayingNow] = useState(false);
  const attemptsRef = useRef(0);

  const { isReady, pay } = useMidtransSnap();

  const fetchOrder = useCallback(async () => {
    try {
      const data = await getOrderStatus(publicId);
      if (data) {
        setOrder(data);
      }
      return data;
    } catch {
      return null;
    }
  }, [publicId]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const data = await fetchOrder();
        if (cancelled) return;
        setLoading(false);

        const isPending = !data || data.status?.toLowerCase() === "pending";
        attemptsRef.current += 1;

        if (isPending && attemptsRef.current < MAX_POLL_ATTEMPTS) {
          timer = setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    };

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [fetchOrder]);

  const handleRefresh = async () => {
    setRefreshing(true);
    attemptsRef.current = 0;
    await fetchOrder();
    setRefreshing(false);
  };

  const handlePayNow = async () => {
    if (!order || payingNow) return;
    setPayingNow(true);

    try {
      const result = await getPaymentToken(order.publicId);

      if (!result.success || !result.data) {
        toast.error(
          result.message ?? "Could not start payment. Please try again.",
        );
        return;
      }

      pay(result.data.token, {
        onSuccess: () => {
          toast.success("Payment successful!");
          fetchOrder();
        },
        onPending: () => {
          toast("Payment is being processed.");
          fetchOrder();
        },
        onClose: () => {
          fetchOrder();
        },
        onError: () => {
          toast.error("Payment failed. Please try again.");
          fetchOrder();
        },
      });
    } catch (err) {
      toast.error("Could not start payment. Please try again.");
      console.log(err);
    } finally {
      setPayingNow(false);
    }
  };

  const isPending = order?.status?.toLowerCase() === "pending";

  return (
    <main className="py-20 sm:py-24 w-full">
      <Container>
        {loading ? (
          <div className="flex justify-center items-center py-32 text-muted-foreground">
            Loading order…
          </div>
        ) : !order ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h2 className="font-display font-bold text-2xl mb-2">
              Order not found
            </h2>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t find this order, or it doesn&apos;t belong to
              your account.
            </p>
            <Link
              href={ROUTES.SHOP}
              className="px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors"
            >
              Browse Laptops
            </Link>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            <OrderStatusBanner
              status={order.status}
              publicId={order.publicId}
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="col-span-1 lg:col-span-8">
                <OrderItemsSummary order={order} />
              </div>
              <div className="col-span-1 lg:col-span-4">
                <div className="lg:sticky lg:top-24 space-y-4">
                  <OrderAddressCard order={order} />
                  <PaymentDetailsCard order={order} />

                  {isPending && (
                    <div className="border rounded-2xl sm:rounded-3xl p-5 bg-white shadow-card">
                      <p className="text-sm text-muted-foreground mb-3">
                        Your payment hasn&apos;t been completed yet. Click below
                        to pay with QRIS, Virtual Account, or card.
                      </p>
                      <button
                        onClick={handlePayNow}
                        disabled={!isReady || payingNow}
                        className="w-full px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {payingNow ? "Opening payment…" : "Complete Payment"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
