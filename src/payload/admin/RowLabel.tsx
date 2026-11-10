"use client";

import { useRowLabel } from "@payloadcms/ui";

/** Shows an array row's heading (or the tile heading) instead of “Section 01”. */
export function HeadingRowLabel() {
  const { data, rowNumber } = useRowLabel<{ heading?: string }>();
  return <span>{data?.heading?.trim() || `Item ${String((rowNumber ?? 0) + 1).padStart(2, "0")}`}</span>;
}
