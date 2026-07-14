import { itemLimits, DEFAULT_LIMIT } from "@/constants/products";

export function getItemLimit(item: string): number {
  return itemLimits[item] ?? DEFAULT_LIMIT;
}

export type DeltaResult =
  | { action: "update"; newCount: number }
  | { action: "remove" }
  | { action: "reject" };

export function applyCountDelta(
  item: string,
  currentCount: number,
  delta: number
): DeltaResult {
  const limit = getItemLimit(item);
  const newCount = currentCount + delta;
  if (newCount <= 0) return { action: "remove" };
  if (newCount > limit) return { action: "reject" };
  return { action: "update", newCount };
}
