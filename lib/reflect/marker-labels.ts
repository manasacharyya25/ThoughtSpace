import type { JournalMarkerType } from "@/types/journal";

export const MARKER_TYPE_LABELS: Record<JournalMarkerType, string> = {
  insight: "Insight",
  todo: "Todo",
  grateful: "Grateful",
  reminder: "Reminder",
};

export const MARKER_TYPE_ORDER: JournalMarkerType[] = [
  "insight",
  "todo",
  "grateful",
  "reminder",
];

export function getMarkerTypeLabel(type: JournalMarkerType): string {
  return MARKER_TYPE_LABELS[type];
}
