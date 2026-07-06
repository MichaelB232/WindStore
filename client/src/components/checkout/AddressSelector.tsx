"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/shadcn/button";
import { Address } from "@/src/lib/user/AddressType";
import { getMyAddresses } from "@/src/services/address/address.service";
import AddressFormDialog from "@/src/components/address/AddressFormDialog";

interface AddressSelectorProps {
  selectedAddressId: number | null;
  onSelect: (addressId: number) => void;
}

export default function AddressSelector({
  selectedAddressId,
  onSelect,
}: AddressSelectorProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAddresses()
      .then((list) => {
        setAddresses(list);
        if (!selectedAddressId) {
          const def = list.find((a) => a.isDefault) ?? list[0];
          if (def) onSelect(def.id);
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreated = (address: Address) => {
    setAddresses((prev) => {
      const next = address.isDefault
        ? prev.map((a) => ({ ...a, isDefault: false }))
        : prev;
      return [address, ...next];
    });
    onSelect(address.id);
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-card">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h2 className="font-display text-2xl font-bold">Shipping Address</h2>
        <AddressFormDialog
          mode="create"
          onSaved={handleCreated}
          trigger={
            <Button variant="outline" size="sm">
              <Plus size={14} />
              Add New
            </Button>
          }
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground text-sm">
          <Loader2 size={16} className="animate-spin" />
          Loading addresses…
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center text-center py-8 border border-dashed border-gray-200 rounded-xl">
          <MapPin size={32} className="text-muted-foreground mb-2" />
          <p className="font-medium">No saved address</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add a shipping address to continue with checkout.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((address) => {
            const selected = address.id === selectedAddressId;
            return (
              <button
                key={address.id}
                type="button"
                onClick={() => onSelect(address.id)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                  selected
                    ? "border-accent bg-accent-muted/30"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected
                      ? "border-accent bg-accent text-white"
                      : "border-gray-300"
                  }`}
                >
                  {selected && <CheckCircle2 size={14} className="fill-accent text-white" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{address.label}</p>
                    {address.isDefault && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {address.recipientName} · {address.phone}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {address.fullAddress}, {address.district}, {address.city},{" "}
                    {address.province} {address.postalCode}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
