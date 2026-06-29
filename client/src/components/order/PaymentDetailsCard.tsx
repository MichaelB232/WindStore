import { CreditCard } from "lucide-react";
import { Order } from "@/src/lib/producttype/OrderType";
import { formatPrice } from "@/src/utils/utils";

type PaymentDetailsCardProps = {
  order: Order;
};

export default function PaymentDetailsCard({ order }: PaymentDetailsCardProps) {
  const payment = order.payments[0];

  return (
    <aside className="rounded-3xl bg-white p-8 shadow-card">
      <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
        <CreditCard size={20} className="text-accent" />
        Payment Details
      </h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-medium">{formatPrice(order.totalPrice)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <span className="font-medium capitalize">
            {payment?.status ?? order.status}
          </span>
        </div>

        {payment?.transactionId && (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground shrink-0">
              Transaction ID
            </span>
            <span className="font-mono text-xs text-right break-all">
              {payment.transactionId}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
