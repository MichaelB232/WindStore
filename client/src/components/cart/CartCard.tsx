"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  PackageX,
  TriangleAlert,
  Trash2,
} from "lucide-react";
import { CartItem } from "@/src/lib/producttype/ProductType";
import { getCartStockInfo } from "@/src/lib/cart/cartStock";
import { formatPrice } from "@/src/utils/utils";
import { useCartSelection } from "@/src/services/cart/context/CartSelectionContext";
type CartCardProps = {
  item: CartItem;
  onRemove: (cartItemId: number) => void;
};
import Link from "next/link";
import { ROUTES } from "@/src/routes/routes";

export default function CartCard({ item, onRemove }: CartCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [removing, setRemoving] = useState(false);

  const { product, productConfig, quantity } = item;
  const { isSelected, toggle, deselectMany } = useCartSelection();

  const basePrice = parseFloat(product.basePrice);
  const configPrice = productConfig
    ? parseFloat(productConfig.priceModifier)
    : 0;
  const unitPrice = basePrice + configPrice;
  const totalPrice = unitPrice * quantity;

  const {
    status: stockStatus,
    availableStock,
    isBlocked,
  } = getCartStockInfo(item);
  const checked = isSelected(item.id) && !isBlocked;

  // If this item becomes stock-blocked (e.g. after a refresh lowers the
  // available stock) while it's still selected, drop it from the selection
  // instead of silently carrying an invalid item into checkout totals.
  useEffect(() => {
    if (isBlocked && isSelected(item.id)) {
      deselectMany([item.id]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBlocked, item.id]);

  const specEntries = [
    ["CPU", product.specs.processor],
    ["GPU", product.specs.gpu],
    ["RAM", product.specs.ram],
    ["Storage", product.specs.storage],
    ["Display", product.specs.display],
    ["OS", product.specs.os],
  ].filter(([, v]) => Boolean(v));

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(item.id);
  };

  return (
    <div
      className={`w-full rounded-3xl bg-white shadow-card overflow-hidden mb-5 transition ease-in duration-200 hover:shadow-card-hover ${
        isBlocked ? "opacity-75" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center">
        {/* Selection checkbox */}
        <div className="pl-8 shrink-0 self-stretch flex items-center">
          <input
            type="checkbox"
            checked={checked}
            disabled={isBlocked}
            onChange={() => toggle(item.id)}
            aria-label={
              isBlocked
                ? `${product.name} can't be checked out right now`
                : `Select ${product.name} for checkout`
            }
            className="size-5 shrink-0 rounded border-gray-300 accent-accent disabled:cursor-not-allowed disabled:opacity-40"
          />
        </div>

        <Link
          href={`${ROUTES.LAPTOP}/${item.product.slug}`}
          className="flex flex-1 items-center gap-6 p-8 "
          title={`Go to ${product.name} detail page`}
        >
          {/* Thumbnail */}
          <div className="relative size-28 shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="112px"
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-1 font-semibold">
              {product.brand.name}
            </p>

            <h3 className="text-2xl font-bold font-display truncate">
              {product.name}
            </h3>

            {productConfig && (
              <p className="mt-1 text-sm text-muted-foreground">
                {productConfig.configType}: {productConfig.configName}
              </p>
            )}

            {quantity > 1 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Qty: {quantity}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-accent">
              {formatPrice(totalPrice)}
            </p>

            {quantity > 1 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatPrice(unitPrice)} each
              </p>
            )}
          </div>
        </Link>

        {/* Expand Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-8 text-muted-foreground hover:text-accent transition cursor-pointer self-stretch flex items-center justify-center"
        >
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>

      {/* Stock warning banners */}
      {stockStatus === "out_of_stock" && (
        <div className="mx-8 mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <PackageX size={18} className="text-red-600 shrink-0" />
          <span className="text-sm text-red-700">
            Out of stock. This item won&apos;t be included in checkout.
          </span>
        </div>
      )}

      {stockStatus === "insufficient_stock" && (
        <div className="mx-8 mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <TriangleAlert size={18} className="text-amber-600 shrink-0" />
          <span className="text-sm text-amber-700">
            Only {availableStock} left in stock — you have {quantity} in your
            cart. Lower the quantity to continue with this item.
          </span>
        </div>
      )}

      {/* Expanded details */}
      {isExpanded && (
        <>
          <div className="border-t border-border" />
          <div className="p-8">
            <h4 className="mb-8 text-sm font-semibold tracking-[0.2em] text-accent uppercase">
              Configuration Details
            </h4>

            <div className="grid grid-cols-2 gap-x-20 gap-y-6">
              {specEntries.map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
              {productConfig && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {productConfig.configType}
                  </span>
                  <span className="font-medium">
                    {productConfig.configName}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-12 flex justify-end gap-4">
              <button
                onClick={handleRemove}
                disabled={removing}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-red-500 hover:bg-red-50 transition disabled:opacity-50 cursor-pointer"
              >
                <Trash2 size={16} />
                {removing ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
