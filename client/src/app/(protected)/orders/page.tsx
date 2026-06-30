"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import Container from "@/src/components/layout/Container";
import OrderListCard from "@/src/components/order/OrderListCard";
import { Order } from "@/src/lib/producttype/OrderType";
import { getAllMyOrder } from "@/src/services/order/order.service";
import { ROUTES } from "@/src/routes/routes";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllMyOrder()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="py-24 w-full">
      <Container>
        <div className="mb-10">
          <h1 className="font-bold font-display text-4xl">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading
              ? "Loading…"
              : orders.length === 0
                ? "You haven't placed any orders yet"
                : `${orders.length} ${orders.length === 1 ? "order" : "orders"} placed`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32 text-muted-foreground">
            Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <PackageSearch size={48} className="text-muted-foreground mb-4" />
            <h2 className="font-display font-bold text-2xl mb-2">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-6">
              When you place an order, it&apos;ll show up here.
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
            {orders.map((order) => (
              <OrderListCard key={order.publicId} order={order} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
