import { CheckCircle2, Clock, XCircle, RotateCw, LucideIcon } from "lucide-react";

type OrderStatusBannerProps = {
  status: string;
  orderId: number;
  onRefresh: () => void;
  refreshing: boolean;
};

type StatusConfig = {
  label: string;
  description: string;
  color: string;
  bg: string;
  icon: LucideIcon;
};

const STATUS_MAP: Record<string, StatusConfig> = {
  paid: {
    label: "Payment Successful",
    description: "Your order has been confirmed and is being prepared.",
    color: "text-green-600",
    bg: "bg-green-50",
    icon: CheckCircle2,
  },
  pending: {
    label: "Payment Pending",
    description:
      "We're waiting for your payment to be confirmed. This page updates automatically.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: Clock,
  },
  cancelled: {
    label: "Payment Failed",
    description:
      "Your payment wasn't completed. You can place a new order from your cart.",
    color: "text-red-600",
    bg: "bg-red-50",
    icon: XCircle,
  },
};

export default function OrderStatusBanner({
  status,
  orderId,
  onRefresh,
  refreshing,
}: OrderStatusBannerProps) {
  const key = status?.toLowerCase() ?? "pending";
  const config = STATUS_MAP[key] ?? STATUS_MAP.pending;
  const Icon = config.icon;

  return (
    <div className={`rounded-3xl p-8 shadow-card ${config.bg}`}>
      <div className="flex items-start gap-4">
        <Icon size={32} className={`${config.color} shrink-0`} />

        <div className="flex-1">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Order #{orderId}
          </p>
          <h1 className={`font-display text-3xl font-bold mt-1 ${config.color}`}>
            {config.label}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {config.description}
          </p>
        </div>

        {key === "pending" && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-accent hover:bg-white/60 transition disabled:opacity-50 cursor-pointer shrink-0"
          >
            <RotateCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        )}
      </div>
    </div>
  );
}
