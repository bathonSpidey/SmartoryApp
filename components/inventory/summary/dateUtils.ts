// ─────────────────────────────────────────────
//  dateUtils — shared receipt date helpers
// ─────────────────────────────────────────────

export function parseFlexDate(raw: string): Date {
  if (!raw) return new Date(0);
  const slash = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash)
    return new Date(
      `${slash[3]}-${slash[1].padStart(2, "0")}-${slash[2].padStart(2, "0")}`,
    );
  const dot = raw.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dot)
    return new Date(
      `${dot[3]}-${dot[2].padStart(2, "0")}-${dot[1].padStart(2, "0")}`,
    );
  try {
    return new Date(raw);
  } catch {
    return new Date(0);
  }
}

export function receiptDate(r: {
  raw_response: { date?: string };
  created_at: string;
}): Date {
  return parseFlexDate(r.raw_response.date ?? r.created_at);
}
