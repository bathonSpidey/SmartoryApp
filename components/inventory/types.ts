// ─────────────────────────────────────────────
//  Inventory types — re-exported from the
//  service layer so there is a single source
//  of truth.  Import from here in UI components.
// ─────────────────────────────────────────────

export type {
  SavedReceipt as Receipt,
  SavedReceiptItem as ReceiptItem,
  GetReceiptsResponse as ReceiptsResponse,
} from "@/lib/receipt.service";
