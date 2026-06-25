export function parsePrice(basePrice: string): number {
  return parseFloat(basePrice);
}

export function formatPrice(value: string | number): string {
  const amount = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}