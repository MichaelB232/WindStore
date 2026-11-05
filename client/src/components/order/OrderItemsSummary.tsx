import OrderItemRow from "@/src/components/order/OrderItemRow";
import { Order } from "@/src/lib/order/OrderType";
import { formatPrice } from "@/src/utils/utils";

type OrderItemsSummaryProps = {
  order: Order;
};

export default function OrderItemsSummary({ order }: OrderItemsSummaryProps) {
  const isPaid =
    order.status?.toLowerCase() === "paid" ||
    order.status?.toLowerCase() === "completed";

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-8 shadow-card">
      <h2 className="font-display text-xl sm:text-2xl font-bold mb-2">Order Items</h2>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4">
        {order.orderItems.length}{" "}
        {order.orderItems.length === 1 ? "item" : "items"}
      </p>

      <div>
        {order.orderItems.map((item) => (
          <OrderItemRow key={item.id} item={item} isPaid={isPaid} />
        ))}
      </div>

      <div className="my-5 sm:my-6 border-t border-border" />

      <div className="flex items-end justify-between">
        <span className="text-lg sm:text-xl font-medium">Total</span>
        <span className="text-xl sm:text-2xl font-display font-bold text-accent">
          {formatPrice(order.totalPrice)}
        </span>
      </div>
    </div>
  );
}
