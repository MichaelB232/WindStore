"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Container from "@/src/components/layout/Container";
import OrderStatusBanner from "@/src/components/order/OrderStatusBanner";
import OrderItemsSummary from "@/src/components/order/OrderItemsSummary";
import PaymentDetailsCard from "@/src/components/order/PaymentDetailsCard";
import { Order } from "@/src/lib/producttype/OrderType";
import { getOrderStatus } from "@/src/services/order/order.service";
import { ROUTES } from "@/src/routes/routes";

const POLL_INTERVAL_MS = 4000;
const MAX_POLL_ATTEMPTS = 15;

export default function OrderStatusPage() {
  const { orderId } = useParams() as { orderId: string };

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const attemptsRef = useRef(0);

  const fetchOrder = useCallback(async () => {
    const data = await getOrderStatus(orderId);
    setOrder(data);
    return data;
  }, [orderId]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      const data = await fetchOrder();
      if (cancelled) return;
      setLoading(false);

      const isPending = !data || data.status?.toLowerCase() === "pending";
      attemptsRef.current += 1;

      if (isPending && attemptsRef.current < MAX_POLL_ATTEMPTS) {
        timer = setTimeout(poll, POLL_INTERVAL_MS);
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

  return (
    <main className="py-24 w-full">
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
              We couldn&apos;t find this order, or it doesn&apos;t belong to your account.
            </p>
            <Link
              href={ROUTES.SHOP}
              className="px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors"
            >
              Browse Laptops
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <OrderStatusBanner
              status={order.status}
              orderId={order.id}
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />

            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8">
                <OrderItemsSummary order={order} />
              </div>
              <div className="col-span-4">
                <div className="sticky top-24">
                  <PaymentDetailsCard order={order} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
