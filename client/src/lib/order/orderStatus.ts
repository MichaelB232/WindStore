import {
  CheckCircle2,
  Clock,
  XCircle,
  PackageCheck,
  Truck,
  LucideIcon,
} from "lucide-react";

export type StatusConfig = {
  label: string;
  description: string;
  color: string;
  bg: string;
  dot: string;
  icon: LucideIcon;
};

const ORDER_STATUS_MAP: Record<string, StatusConfig> = {
  pending: {
    label: "Pending",
    description:
      "Waiting for your payment to be confirmed.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
    icon: Clock,
  },
  paid: {
    label: "Paid",
    description: "Payment confirmed, order is being prepared.",
    color: "text-green-600",
    bg: "bg-green-50",
    dot: "bg-green-500",
    icon: CheckCircle2,
  },
  processing: {
    label: "Processing",
    description: "Your order is being prepared for shipment.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    dot: "bg-blue-500",
    icon: PackageCheck,
  },
  shipped: {
    label: "Shipped",
    description: "Your order is on its way.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    dot: "bg-blue-500",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    description: "Your order has been delivered.",
    color: "text-green-600",
    bg: "bg-green-50",
    dot: "bg-green-500",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    description: "This order was cancelled.",
    color: "text-red-600",
    bg: "bg-red-50",
    dot: "bg-red-500",
    icon: XCircle,
  },
};

const DEFAULT_STATUS: StatusConfig = {
  label: "Unknown",
  description: "Status unavailable.",
  color: "text-muted-foreground",
  bg: "bg-muted",
  dot: "bg-muted-foreground",
  icon: Clock,
};

export function getOrderStatusConfig(status?: string | null): StatusConfig {
  const key = status?.toLowerCase() ?? "pending";
  return ORDER_STATUS_MAP[key] ?? DEFAULT_STATUS;
}

const PAYMENT_STATUS_MAP: Record<string, StatusConfig> = {
  success: {
    label: "Paid",
    description: "Payment received.",
    color: "text-green-600",
    bg: "bg-green-50",
    dot: "bg-green-500",
    icon: CheckCircle2,
  },
  pending: {
    label: "Awaiting Payment",
    description: "Payment not yet completed.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
    icon: Clock,
  },
  failed: {
    label: "Failed",
    description: "Payment failed.",
    color: "text-red-600",
    bg: "bg-red-50",
    dot: "bg-red-500",
    icon: XCircle,
  },
  cancelled: {
    label: "Cancelled",
    description: "Payment was cancelled.",
    color: "text-red-600",
    bg: "bg-red-50",
    dot: "bg-red-500",
    icon: XCircle,
  },
};

export function getPaymentStatusConfig(status?: string | null): StatusConfig {
  if (!status) {
    return {
      label: "No Payment",
      description: "No payment has been initiated for this order.",
      color: "text-muted-foreground",
      bg: "bg-muted",
      dot: "bg-muted-foreground",
      icon: Clock,
    };
  }
  const key = status.toLowerCase();
  return PAYMENT_STATUS_MAP[key] ?? DEFAULT_STATUS;
}
