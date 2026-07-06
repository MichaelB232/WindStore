import { MapPin, User, Phone } from "lucide-react";
import { Order } from "@/src/lib/order/OrderType";

type OrderAddressCardProps = {
  order: Order;
};

export default function OrderAddressCard({ order }: OrderAddressCardProps) {
  const address = order.address;

  return (
    <aside className="rounded-3xl bg-white p-8 shadow-card">
      <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
        <MapPin size={20} className="text-accent" />
        Shipping Address
      </h2>

      {!address ? (
        <p className="text-sm text-muted-foreground">
          This order&apos;s address is no longer available. It may have been
          removed from your saved addresses after this order was placed.
        </p>
      ) : (
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-base">
              {address.label}
            </span>
          </div>

          <p className="flex items-center gap-2 text-gray-700">
            <User size={14} className="text-accent shrink-0" />
            {address.recipientName}
          </p>

          <p className="flex items-center gap-2 text-gray-700">
            <Phone size={14} className="text-accent shrink-0" />
            {address.phone}
          </p>

          <p className="text-muted-foreground leading-relaxed">
            {address.fullAddress}
            <br />
            {address.district}, {address.city}, {address.province}{" "}
            {address.postalCode}
          </p>
        </div>
      )}
    </aside>
  );
}
