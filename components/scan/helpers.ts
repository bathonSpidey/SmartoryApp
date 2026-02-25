export function uniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function fileIcon(mimeType: string): string {
  if (mimeType === "application/pdf") return "document-text-outline";
  return "image-outline";
}

export function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toFixed(2)}`;
}
