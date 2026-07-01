"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import OrderListCard from "@/src/components/order/OrderListCard";
import { Order } from "@/src/lib/producttype/OrderType";
import { getAllMyOrder } from "@/src/services/order/order.service";
import { ROUTES } from "@/src/routes/routes";

export default function ProfileOrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMyOrder()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const paidOrders = useMemo(
    () =>
      orders.filter((order) => {
        const orderPaid = order.status?.toLowerCase() === "paid";
        const paymentSuccess =
          order.payments[0]?.status?.toLowerCase() === "success";
        return orderPaid && paymentSuccess;
      }),
    [orders],
  );

  return (
    <section>
      <div className="mb-8">
        <h1 className="font-bold font-display text-3xl">Order History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {loading
            ? "Loading…"
            : paidOrders.length === 0
              ? "No paid orders yet"
              : `${paidOrders.length} paid ${paidOrders.length === 1 ? "order" : "orders"}`}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24 text-muted-foreground">
          Loading orders…
        </div>
      ) : paidOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white py-24 text-center shadow-card">
          <PackageSearch size={48} className="text-muted-foreground mb-4" />
          <h2 className="font-display font-bold text-2xl mb-2">
            No paid orders yet
          </h2>
          <p className="text-muted-foreground mb-6">
            Orders show up here once payment is confirmed.
          </p>
          <Link
            href={ROUTES.SHOP}
            className="px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent-hover transition-colors"
          >
            Browse Laptops
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {paidOrders.map((order) => (
            <OrderListCard key={order.publicId} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}
