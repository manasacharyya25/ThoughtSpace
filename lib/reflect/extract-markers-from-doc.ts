import type { JournalMarkerType } from "@/types/journal";
import { JOURNAL_MARKER_TYPES } from "@/types/journal";

export interface ExtractedMarker {
  markId: string;
  type: JournalMarkerType;
  text: string;
}

type TipTapMark = {
  type?: string;
  attrs?: Record<string, unknown>;
};

type TipTapNode = {
  type?: string;
  text?: string;
  marks?: TipTapMark[];
  content?: TipTapNode[];
};

function isMarkerType(value: unknown): value is JournalMarkerType {
  return (
    typeof value === "string" &&
    (JOURNAL_MARKER_TYPES as readonly string[]).includes(value)
  );
}

function walkNode(node: TipTapNode, markers: ExtractedMarker[]) {
  if (node.type === "text" && node.text && Array.isArray(node.marks)) {
    const journalMark = node.marks.find((mark) => mark.type === "journalMarker");
    const markerId = journalMark?.attrs?.markerId;
    const markerType = journalMark?.attrs?.markerType;

    if (
      typeof markerId === "string" &&
      markerId.length > 0 &&
      isMarkerType(markerType) &&
      node.text.trim().length > 0
    ) {
      markers.push({
        markId: markerId,
        type: markerType,
        text: node.text,
      });
    }
  }

  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      walkNode(child, markers);
    }
  }
}

export function extractMarkersFromDoc(
  doc: Record<string, unknown>
): ExtractedMarker[] {
  const markers: ExtractedMarker[] = [];
  walkNode(doc as TipTapNode, markers);
  return markers;
}
