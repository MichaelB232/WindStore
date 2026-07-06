"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, MapPin } from "lucide-react";
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
import { Input } from "@/src/components/ui/shadcn/input";
import { Address, AddressPayload } from "@/src/lib/user/AddressType";
import {
  createAddress,
  updateAddress,
} from "@/src/services/address/address.service";
import AddressValidator, {
  AddressErrors,
  hasAddressErrors,
} from "@/src/services/address/address.validator";

const EMPTY_FORM: AddressPayload = {
  label: "",
  recipientName: "",
  phone: "",
  province: "",
  city: "",
  district: "",
  postalCode: "",
  fullAddress: "",
  isDefault: false,
};

const EMPTY_ERRORS: AddressErrors = {
  label: "",
  recipientName: "",
  phone: "",
  province: "",
  city: "",
  district: "",
  postalCode: "",
  fullAddress: "",
  general: "",
};

interface AddressFormDialogProps {
  mode: "create" | "edit";
  address?: Address;
  onSaved: (address: Address) => void;
  trigger: React.ReactNode;
}

export default function AddressFormDialog({
  mode,
  address,
  onSaved,
  trigger,
}: AddressFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<AddressPayload>(
    address
      ? {
          label: address.label,
          recipientName: address.recipientName,
          phone: address.phone,
          province: address.province,
          city: address.city,
          district: address.district,
          postalCode: address.postalCode,
          fullAddress: address.fullAddress,
          isDefault: address.isDefault,
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<AddressErrors>(EMPTY_ERRORS);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      // reset form to the current address (or blank) each time it's opened
      setForm(
        address
          ? {
              label: address.label,
              recipientName: address.recipientName,
              phone: address.phone,
              province: address.province,
              city: address.city,
              district: address.district,
              postalCode: address.postalCode,
              fullAddress: address.fullAddress,
              isDefault: address.isDefault,
            }
          : EMPTY_FORM,
      );
      setErrors(EMPTY_ERRORS);
    }
  };

  const setField = (field: keyof AddressPayload, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const validationErrors = AddressValidator(form);
    setErrors(validationErrors);
    if (hasAddressErrors(validationErrors)) return;

    setSubmitting(true);

    const result =
      mode === "create"
        ? await createAddress(form)
        : await updateAddress(address!.id, form);

    setSubmitting(false);

    if (!result.success || !result.data) {
      setErrors((prev) => ({
        ...prev,
        general: result.message ?? "Failed to save address",
      }));
      toast.error(result.message ?? "Failed to save address");
      return;
    }

    toast.success(
      mode === "create" ? "Address added" : "Address updated",
    );
    onSaved(result.data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex gap-3 items-center">
            <MapPin size={20} className="text-accent" />
            <DialogTitle className="text-lg font-display">
              {mode === "create" ? "Add New Address" : "Edit Address"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {mode === "create"
              ? "Add a new shipping address to your account."
              : "Update the details of this shipping address."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="label" className="text-sm font-medium text-gray-700">
                Label
              </label>
              <Input
                id="label"
                placeholder="Home, Office, etc."
                value={form.label}
                onChange={(e) => setField("label", e.target.value)}
              />
              {errors.label && (
                <p className="text-danger text-xs">{errors.label}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="recipientName"
                className="text-sm font-medium text-gray-700"
              >
                Recipient Name
              </label>
              <Input
                id="recipientName"
                placeholder="John Doe"
                value={form.recipientName}
                onChange={(e) => setField("recipientName", e.target.value)}
              />
              {errors.recipientName && (
                <p className="text-danger text-xs">{errors.recipientName}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Input
              id="phone"
              placeholder="08123456789"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
            />
            {errors.phone && (
              <p className="text-danger text-xs">{errors.phone}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="province"
                className="text-sm font-medium text-gray-700"
              >
                Province
              </label>
              <Input
                id="province"
                placeholder="Jawa Tengah"
                value={form.province}
                onChange={(e) => setField("province", e.target.value)}
              />
              {errors.province && (
                <p className="text-danger text-xs">{errors.province}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="city" className="text-sm font-medium text-gray-700">
                City
              </label>
              <Input
                id="city"
                placeholder="Semarang"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
              />
              {errors.city && (
                <p className="text-danger text-xs">{errors.city}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="district"
                className="text-sm font-medium text-gray-700"
              >
                District
              </label>
              <Input
                id="district"
                placeholder="Semarang Selatan"
                value={form.district}
                onChange={(e) => setField("district", e.target.value)}
              />
              {errors.district && (
                <p className="text-danger text-xs">{errors.district}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="postalCode"
                className="text-sm font-medium text-gray-700"
              >
                Postal Code
              </label>
              <Input
                id="postalCode"
                placeholder="50242"
                value={form.postalCode}
                onChange={(e) => setField("postalCode", e.target.value)}
              />
              {errors.postalCode && (
                <p className="text-danger text-xs">{errors.postalCode}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="fullAddress"
              className="text-sm font-medium text-gray-700"
            >
              Full Address
            </label>
            <textarea
              id="fullAddress"
              placeholder="Jl. Pandanaran No. 1 RT 02/RW 03"
              value={form.fullAddress}
              onChange={(e) => setField("fullAddress", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {errors.fullAddress && (
              <p className="text-danger text-xs">{errors.fullAddress}</p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
            <input
              type="checkbox"
              checked={form.isDefault ?? false}
              onChange={(e) => setField("isDefault", e.target.checked)}
              className="size-4 rounded border-input accent-accent"
            />
            Set as default address
          </label>

          {errors.general && (
            <p className="text-danger text-sm">{errors.general}</p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-accent text-white hover:bg-accent-hover"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving…
                </>
              ) : mode === "create" ? (
                "Add Address"
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
