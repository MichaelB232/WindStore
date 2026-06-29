import CheckoutItemRow from "@/src/components/checkout/CheckoutItemRow";
import { CartItem } from "@/src/lib/producttype/ProductType";

type CheckoutItemsListProps = {
  items: CartItem[];
};

export default function CheckoutItemsList({ items }: CheckoutItemsListProps) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-card">
      <h2 className="font-display text-2xl font-bold mb-2">Order Items</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {items.length} {items.length === 1 ? "item" : "items"} in this order
      </p>

      <div>
        {items.map((item) => (
          <CheckoutItemRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
