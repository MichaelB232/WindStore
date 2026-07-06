import { AddressPayload } from "@/src/lib/user/AddressType";

export interface AddressErrors {
  label: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  fullAddress: string;
  general: string;
}

export default function AddressValidator(
  data: AddressPayload,
): AddressErrors {
  const errors: AddressErrors = {
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

  if (!data.label.trim()) {
    errors.label = "* This field is required";
  }

  if (!data.recipientName.trim()) {
    errors.recipientName = "* This field is required";
  }

  if (!data.phone.trim()) {
    errors.phone = "* This field is required";
  } else if (!/^[0-9+\-\s]{8,15}$/.test(data.phone.trim())) {
    errors.phone = "* Invalid phone number format";
  }

  if (!data.province.trim()) {
    errors.province = "* This field is required";
  }

  if (!data.city.trim()) {
    errors.city = "* This field is required";
  }

  if (!data.district.trim()) {
    errors.district = "* This field is required";
  }

  if (!data.postalCode.trim()) {
    errors.postalCode = "* This field is required";
  } else if (!/^[0-9]{4,10}$/.test(data.postalCode.trim())) {
    errors.postalCode = "* Invalid postal code";
  }

  if (!data.fullAddress.trim()) {
    errors.fullAddress = "* This field is required";
  }

  return errors;
}

export function hasAddressErrors(errors: AddressErrors): boolean {
  return Object.entries(errors).some(
    ([key, value]) => key !== "general" && value !== "",
  );
}
