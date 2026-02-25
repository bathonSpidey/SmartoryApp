// ─────────────────────────────────────────────
//  Smartory — Receipt Service
//  Extracts structured data from receipt images/PDFs
//  via the /agents/extract-receipt endpoint.
// ─────────────────────────────────────────────

const BASE_URL = "http://127.0.0.1:8000";

// ─── Response types ───────────────────────────

export type ReceiptItem = {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
};

export type ReceiptData = {
  date: string;
  items: ReceiptItem[];
  total_amount: number;
  currency: string;
  store_name: string;
  type_of_receipt: string;
};

export type ExtractReceiptResponse = {
  status: "success" | "error";
  data: ReceiptData;
};

// ─── File descriptor ──────────────────────────

export type ReceiptFile = {
  /** Local URI of the file (file:// or content://) */
  uri: string;
  /** Display name, e.g. "receipt.png" */
  name: string;
  /** MIME type, e.g. "image/png", "application/pdf" */
  mimeType: string;
};

// ─── API call ─────────────────────────────────

/**
 * Sends a single receipt file to the backend and returns the
 * extracted structured data.  The backend only accepts one file
 * per request, so call this once per file when uploading multiple.
 */
export async function extractReceipt(
  token: string,
  file: ReceiptFile,
): Promise<ExtractReceiptResponse> {
  // Fetch the local file URI as a real Blob so that React Native / Expo
  // doesn't serialize the object literal as the string "[object Object]".
  const fileBlob = await fetch(file.uri).then((r) => r.blob());

  const formData = new FormData();
  formData.append("file", fileBlob, file.name);

  const response = await fetch(`${BASE_URL}/agents/extract-receipt`, {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
      // NOTE: Do NOT set Content-Type manually — fetch will set the
      // correct multipart/form-data boundary automatically.
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Receipt extraction failed: HTTP ${response.status}${text ? ` — ${text}` : ""}`,
    );
  }

  return response.json() as Promise<ExtractReceiptResponse>;
}

// ─── Inventory: list saved receipts ──────────

export type SavedReceiptItem = {
  name: string;
  unit: string;
  price: number;
  category: string;
  quantity: number;
};

export type SavedReceipt = {
  id: string;
  user_id: string;
  store_name: string;
  total_amount: number;
  items: SavedReceiptItem[];
  raw_response: {
    date: string;
    currency: string;
    type_of_receipt: string;
    store_name: string;
    total_amount: number;
    items: SavedReceiptItem[];
  };
  created_at: string;
};

export type GetReceiptsResponse = {
  status: "success" | "error";
  data: SavedReceipt[];
};

/**
 * Fetches all saved receipts for the authenticated user.
 */
export async function getReceipts(token: string): Promise<SavedReceipt[]> {
  const res = await fetch(`${BASE_URL}/receipts`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);

  const json: GetReceiptsResponse = await res.json();
  if (json.status !== "success")
    throw new Error("Unexpected response from server");

  return [...json.data].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}
