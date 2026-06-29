import OrderItemRow from "@/src/components/order/OrderItemRow";
import { Order } from "@/src/lib/producttype/OrderType";
import { formatPrice } from "@/src/utils/utils";

type OrderItemsSummaryProps = {
  order: Order;
};

export default function OrderItemsSummary({ order }: OrderItemsSummaryProps) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-card">
      <h2 className="font-display text-2xl font-bold mb-2">Order Items</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {order.orderItems.length}{" "}
        {order.orderItems.length === 1 ? "item" : "items"}
      </p>

      <div>
        {order.orderItems.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </div>

      <div className="my-6 border-t border-border" />

      <div className="flex items-end justify-between">
        <span className="text-xl font-medium">Total</span>
        <span className="text-2xl font-display font-bold text-accent">
          {formatPrice(order.totalPrice)}
        </span>
      </div>
    </div>
  );
}
