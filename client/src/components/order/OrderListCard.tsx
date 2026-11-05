import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { Order } from "@/src/lib/order/OrderType";
import { formatPrice } from "@/src/utils/utils";
import { ROUTES } from "@/src/routes/routes";
import {
  getOrderStatusConfig,
  getPaymentStatusConfig,
} from "@/src/lib/order/orderStatus";

type OrderListCardProps = {
  order: Order;
};

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrderListCard({ order }: OrderListCardProps) {
  const statusConfig = getOrderStatusConfig(order.status);
  const payment = order.payments[0];
  const paymentConfig = getPaymentStatusConfig(payment?.status);
  const itemCount = order.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const previewItems = order.orderItems.slice(0, 3);
  const extraCount = order.orderItems.length - previewItems.length;

  return (
    <Link
      href={ROUTES.ORDER_DETAIL(order.publicId)}
      className="group block w-full rounded-2xl sm:rounded-3xl bg-white shadow-card overflow-hidden transition ease-in duration-200 hover:shadow-card-hover"
    >
      {/* Header */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 px-4 sm:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-border">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Package size={16} className="text-muted-foreground shrink-0" />
          <p className="text-xs sm:text-sm font-mono uppercase tracking-widest text-muted-foreground truncate">
            Order #{order.publicId}
          </p>
          <span className="text-muted-foreground/40">•</span>
          <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-xs font-semibold whitespace-nowrap shrink-0 ${statusConfig.bg} ${statusConfig.color}`}
        >
          <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
          {statusConfig.label}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-8">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Item thumbnails */}
          <div className="flex -space-x-3 sm:-space-x-4 shrink-0">
            {previewItems.map((item) => (
              <div
                key={item.id}
                className="relative size-16 sm:size-20 overflow-hidden rounded-xl bg-muted ring-2 sm:ring-4 ring-white"
              >
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  sizes="80px"
                  className="object-contain"
                  unoptimized
                />
              </div>
            ))}
            {extraCount > 0 && (
              <div className="relative size-16 sm:size-20 flex items-center justify-center rounded-xl bg-surface-alt ring-2 sm:ring-4 ring-white text-xs sm:text-sm font-semibold text-muted-foreground">
                +{extraCount}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold font-display truncate">
              {previewItems[0]?.product.name}
              {order.orderItems.length > 1 &&
                ` + ${order.orderItems.length - 1} more`}
            </h3>
            {previewItems[0]?.productConfig && (
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground truncate">
                {previewItems[0].productConfig.configName}
              </p>
            )}
            <p className="mt-0.5 sm:mt-1 text-xs text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {/* Payment + Price */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0">
          <p className="text-lg sm:text-xl font-bold text-accent">
            {formatPrice(order.totalPrice)}
          </p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${paymentConfig.bg} ${paymentConfig.color}`}
          >
            <span className={`size-1 rounded-full ${paymentConfig.dot}`} />
            {paymentConfig.label}
          </span>
        </div>

        <ChevronRight
          size={20}
          className="text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition shrink-0 hidden sm:block"
        />
      </div>
    </Link>
  );
}
