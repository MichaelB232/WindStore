"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

const TEMPLATE_ADDRESS: AddressPayload = {
  label: "Rumah (Demo Portfolio)",
  recipientName: "Budi Santoso",
  phone: "081234567890",
  province: "DKI Jakarta",
  city: "Jakarta Selatan",
  district: "Kebayoran Baru",
  postalCode: "12180",
  fullAddress: "Jl. Sudirman Kav. 52-53, Gedung Bursa Efek Indonesia Tower 2 Lt. 17",
  isDefault: true,
};

interface AddressFormDialogProps {
  mode?: "create" | "edit";
  trigger: React.ReactNode;
  address?: Address;
  onSaved: (address: Address) => void;
}

export default function AddressFormDialog({
  mode: propMode,
  trigger,
  address,
  onSaved,
}: AddressFormDialogProps) {
  const mode = propMode ?? (address ? "edit" : "create");
  const [open, setOpen] = useState(false);
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
  const [submitting, setSubmitting] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setErrors(EMPTY_ERRORS);
    } else {
      if (address) {
        setForm({
          label: address.label,
          recipientName: address.recipientName,
          phone: address.phone,
          province: address.province,
          city: address.city,
          district: address.district,
          postalCode: address.postalCode,
          fullAddress: address.fullAddress,
          isDefault: address.isDefault,
        });
      } else {
        setForm(EMPTY_FORM);
      }
    }
  };

  const setField = (field: keyof AddressPayload, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof AddressErrors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFillTemplate = () => {
    setForm(TEMPLATE_ADDRESS);
    setErrors(EMPTY_ERRORS);
    toast.info("Alamat demo otomatis terisi!");
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
          <div className="flex gap-3 items-center justify-between">
            <div className="flex gap-3 items-center">
              <MapPin size={20} className="text-accent" />
              <DialogTitle className="text-lg font-display">
                {mode === "create" ? "Add New Address" : "Edit Address"}
              </DialogTitle>
            </div>
            {mode === "create" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFillTemplate}
                className="text-xs gap-1.5 h-8 border-accent/40 text-accent hover:bg-accent/10"
              >
                <Sparkles size={14} />
                Isi Template Demo
              </Button>
            )}
          </div>
          <DialogDescription>
            {mode === "create"
              ? "Tambahkan alamat pengiriman baru atau klik 'Isi Template Demo' untuk mengisi instan."
              : "Update the details of this shipping address."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {errors.general && (
            <p className="text-xs text-destructive">{errors.general}</p>
          )}

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Address Label
            </label>
            <Input
              placeholder="e.g. Home, Office, Apartment"
              value={form.label}
              onChange={(e) => setField("label", e.target.value)}
              className={errors.label ? "border-destructive" : ""}
            />
            {errors.label && (
              <p className="text-xs text-destructive">{errors.label}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Recipient Name
              </label>
              <Input
                placeholder="Full Name"
                value={form.recipientName}
                onChange={(e) => setField("recipientName", e.target.value)}
                className={errors.recipientName ? "border-destructive" : ""}
              />
              {errors.recipientName && (
                <p className="text-xs text-destructive">{errors.recipientName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Phone Number
              </label>
              <Input
                placeholder="08xxxxxxxxxx"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Province
              </label>
              <Input
                placeholder="e.g. DKI Jakarta"
                value={form.province}
                onChange={(e) => setField("province", e.target.value)}
                className={errors.province ? "border-destructive" : ""}
              />
              {errors.province && (
                <p className="text-xs text-destructive">{errors.province}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                City / Regency
              </label>
              <Input
                placeholder="e.g. Jakarta Selatan"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                District / Sub-district
              </label>
              <Input
                placeholder="e.g. Kebayoran Baru"
                value={form.district}
                onChange={(e) => setField("district", e.target.value)}
                className={errors.district ? "border-destructive" : ""}
              />
              {errors.district && (
                <p className="text-xs text-destructive">{errors.district}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Postal Code
              </label>
              <Input
                placeholder="e.g. 12180"
                value={form.postalCode}
                onChange={(e) => setField("postalCode", e.target.value)}
                className={errors.postalCode ? "border-destructive" : ""}
              />
              {errors.postalCode && (
                <p className="text-xs text-destructive">{errors.postalCode}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Full Street Address
            </label>
            <textarea
              rows={3}
              placeholder="Jl. Nama Jalan No. XX, RT/RW, Patokan..."
              value={form.fullAddress}
              onChange={(e) => setField("fullAddress", e.target.value)}
              className={`w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.fullAddress ? "border-destructive" : ""
              }`}
            />
            {errors.fullAddress && (
              <p className="text-xs text-destructive">{errors.fullAddress}</p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDefault"
              checked={form.isDefault}
              onChange={(e) => setField("isDefault", e.target.checked)}
              className="accent-accent w-4 h-4 rounded"
            />
            <label htmlFor="isDefault" className="text-xs cursor-pointer select-none">
              Jadikan alamat utama (Default Shipping Address)
            </label>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {submitting ? "Saving..." : mode === "create" ? "Save Address" : "Update Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
