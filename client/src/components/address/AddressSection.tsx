"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/shadcn/button";
import { Address } from "@/src/lib/user/AddressType";
import { getMyAddresses } from "@/src/services/address/address.service";
import AddressCard from "./AddressCard";
import AddressFormDialog from "./AddressFormDialog";

export default function AddressSection() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAddresses()
      .then(setAddresses)
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (address: Address) => {
    setAddresses((prev) => {
      // if the new address became default, unset default on the others
      const next = address.isDefault
        ? prev.map((a) => ({ ...a, isDefault: false }))
        : prev;
      return [address, ...next];
    });
  };

  const handleUpdated = (updated: Address) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === updated.id) return updated;
        // unset default on others if the updated one is now default
        if (updated.isDefault && a.isDefault) return { ...a, isDefault: false };
        return a;
      }),
    );
  };

  const handleDeleted = (id: number) => {
    setAddresses((prev) => {
      const remaining = prev.filter((a) => a.id !== id);
      const removed = prev.find((a) => a.id === id);
      // backend promotes the most-recently-created remaining address to default
      if (removed?.isDefault && remaining.length > 0) {
        const promoted = remaining.reduce((latest, a) =>
          (a.createdAt ?? "") > (latest.createdAt ?? "") ? a : latest,
        );
        return remaining.map((a) =>
          a.id === promoted.id ? { ...a, isDefault: true } : a,
        );
      }
      return remaining;
    });
  };

  const handleSetDefault = (updated: Address) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === updated.id })),
    );
  };

  return (
    <div className="shadow-card p-5 rounded-xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex gap-3 items-center">
          <MapPin size={25} className="text-accent" />
          <p className="text-2xl font-bold font-display">
            Shipping Addresses
          </p>
        </div>

        <AddressFormDialog
          mode="create"
          onSaved={handleCreated}
          trigger={
            <Button className="bg-accent text-white hover:bg-accent-hover">
              <Plus size={16} />
              Add Address
            </Button>
          }
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16 text-muted-foreground gap-2">
          <Loader2 size={18} className="animate-spin" />
          Loading addresses…
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-gray-200">
          <MapPin size={40} className="text-muted-foreground mb-3" />
          <p className="font-display font-bold text-lg">
            No addresses yet
          </p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Add a shipping address so checkout is faster next time.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}
    </div>
  );
}
