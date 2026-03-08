export function normalizeRating(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return undefined;
  return Math.max(0, Math.min(10, Math.round(value * 2) / 2));
}
