import Image from "next/image";
import { CartItem } from "@/src/lib/producttype/ProductType";
import { formatPrice } from "@/src/utils/utils";

type CheckoutItemRowProps = {
  item: CartItem;
};

export default function CheckoutItemRow({ item }: CheckoutItemRowProps) {
  const { product, productConfig, quantity } = item;

  const basePrice = parseFloat(product.basePrice);
  const configPrice = productConfig ? parseFloat(productConfig.priceModifier) : 0;
  const unitPrice = basePrice + configPrice;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="flex items-center gap-6 py-6 border-b border-border last:border-b-0">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="80px"
          className="object-contain"
          unoptimized
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-1 font-semibold">
          {product.brand.name}
        </p>
        <h3 className="text-lg font-bold font-display truncate">
          {product.name}
        </h3>
        {productConfig && (
          <p className="mt-1 text-sm text-muted-foreground">
            {productConfig.configType}: {productConfig.configName}
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">Qty: {quantity}</p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-xl font-bold text-accent">
          {formatPrice(totalPrice)}
        </p>
        {quantity > 1 && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatPrice(unitPrice)} each
          </p>
        )}
      </div>
    </div>
  );
}
