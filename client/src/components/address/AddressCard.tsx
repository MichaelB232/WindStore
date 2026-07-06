"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Pencil, Trash2, Star, Loader2, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/src/components/ui/shadcn/dialog";
import { Button } from "@/src/components/ui/shadcn/button";
import { Address } from "@/src/lib/user/AddressType";
import {
  deleteAddress,
  setDefaultAddress,
} from "@/src/services/address/address.service";
import AddressFormDialog from "./AddressFormDialog";

interface AddressCardProps {
  address: Address;
  onUpdated: (address: Address) => void;
  onDeleted: (id: number) => void;
  onSetDefault: (address: Address) => void;
}

export default function AddressCard({
  address,
  onUpdated,
  onDeleted,
  onSetDefault,
}: AddressCardProps) {
  const [settingDefault, setSettingDefault] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSetDefault = async () => {
    if (settingDefault || address.isDefault) return;
    setSettingDefault(true);
    const result = await setDefaultAddress(address.id);
    setSettingDefault(false);

    if (!result.success || !result.data) {
      toast.error(result.message ?? "Failed to set default address");
      return;
    }

    toast.success("Default address updated");
    onSetDefault(result.data);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteAddress(address.id);
    setDeleting(false);

    if (!result.success) {
      toast.error(result.message ?? "Failed to delete address");
      return;
    }

    toast.success(result.message ?? "Address deleted");
    onDeleted(address.id);
  };

  return (
    <div
      className={`rounded-xl border p-5 transition-colors ${
        address.isDefault
          ? "border-accent bg-accent-muted/30"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent">
            <MapPin size={18} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-display font-bold text-lg">
                {address.label}
              </p>
              {address.isDefault && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-white">
                  <Star size={11} className="fill-white" />
                  Default
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-gray-700 mt-1">
              {address.recipientName}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
              <Phone size={13} className="shrink-0" />
              {address.phone}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {address.fullAddress}
            </p>
            <p className="text-sm text-muted-foreground">
              {address.district}, {address.city}, {address.province}{" "}
              {address.postalCode}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
        {!address.isDefault && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSetDefault}
            disabled={settingDefault}
          >
            {settingDefault ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Star size={14} />
            )}
            Set as Default
          </Button>
        )}

        <AddressFormDialog
          mode="edit"
          address={address}
          onSaved={onUpdated}
          trigger={
            <Button variant="outline" size="sm">
              <Pencil size={14} />
              Edit
            </Button>
          }
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-danger hover:bg-danger/10 hover:text-danger border-danger/40"
            >
              <Trash2 size={14} />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this address?</DialogTitle>
              <DialogDescription>
                This will permanently remove &quot;{address.label}&quot; from
                your saved addresses. Past orders using this address will not
                be affected.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="w-40 bg-danger text-white"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Confirm"
                )}
              </Button>
              <DialogClose asChild>
                <Button variant="outline" className="w-40">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
