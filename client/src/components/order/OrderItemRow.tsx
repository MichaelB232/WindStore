import Image from "next/image";
import { OrderItem } from "@/src/lib/producttype/OrderType";
import { formatPrice } from "@/src/utils/utils";

type OrderItemRowProps = {
  item: OrderItem;
};

export default function OrderItemRow({ item }: OrderItemRowProps) {
  const unitPrice = parseFloat(item.unitPrice);
  const totalPrice = unitPrice * item.quantity;

  return (
    <div className="flex items-center gap-6 py-6 border-b border-border last:border-b-0">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          sizes="80px"
          className="object-contain"
          unoptimized
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold font-display truncate">
          {item.product.name}
        </h3>
        {item.productConfig && (
          <p className="mt-1 text-sm text-muted-foreground">
            {item.productConfig.configName}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Qty: {item.quantity}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-xl font-bold text-accent">
          {formatPrice(totalPrice)}
        </p>
        {item.quantity > 1 && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatPrice(unitPrice)} each
          </p>
        )}
      </div>
    </div>
  );
}
