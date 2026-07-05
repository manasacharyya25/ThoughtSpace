import { Mark, mergeAttributes } from "@tiptap/core";
import type { JournalMarkerType } from "@/types/journal";

export const JournalMarkerExtension = Mark.create({
  name: "journalMarker",

  addAttributes() {
    return {
      markerId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-marker-id"),
        renderHTML: (attributes) => ({
          "data-marker-id": attributes.markerId,
        }),
      },
      markerType: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-marker-type"),
        renderHTML: (attributes) => ({
          "data-marker-type": attributes.markerType,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "mark[data-journal-marker]" }];
  },

  renderHTML({ mark, HTMLAttributes }) {
    const markerType = mark.attrs.markerType as JournalMarkerType | null;

    return [
      "mark",
      mergeAttributes(HTMLAttributes, {
        "data-journal-marker": "",
        class: markerType
          ? `journal-marker journal-marker--${markerType}`
          : "journal-marker",
      }),
      0,
    ];
  },
});
