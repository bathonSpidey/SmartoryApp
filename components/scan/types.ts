import { ReceiptData, ReceiptFile } from "@/lib/receipt.service";

export type FileStatus = "pending" | "processing" | "done" | "error";

export type FileEntry = {
  id: string;
  file: ReceiptFile;
  status: FileStatus;
  result?: ReceiptData;
  error?: string;
};
