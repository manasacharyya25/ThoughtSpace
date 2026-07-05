import { MARKER_TYPE_ORDER, getMarkerTypeLabel } from "@/lib/reflect/marker-labels";
import type { JournalMarker, JournalMarkerType } from "@/types/journal";

export interface MarkerSummarySection {
  type: JournalMarkerType;
  label: string;
  markers: JournalMarker[];
}

export function summarizeSessionMarkers(
  markers: JournalMarker[]
): MarkerSummarySection[] {
  const grouped = new Map<JournalMarkerType, JournalMarker[]>();

  for (const marker of markers) {
    const existing = grouped.get(marker.type) ?? [];
    existing.push(marker);
    grouped.set(marker.type, existing);
  }

  return MARKER_TYPE_ORDER.flatMap((type) => {
    const sectionMarkers = grouped.get(type);
    if (!sectionMarkers || sectionMarkers.length === 0) {
      return [];
    }

    return [
      {
        type,
        label: getMarkerTypeLabel(type),
        markers: sectionMarkers,
      },
    ];
  });
}
