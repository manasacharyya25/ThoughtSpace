"use client";

import type { Editor } from "@tiptap/core";
import { useEffect, useRef } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import { getMarkerTypeLabel } from "@/lib/reflect/marker-labels";
import { cn } from "@/lib/utils";
import type { JournalMarkerType } from "@/types/journal";
import { JOURNAL_MARKER_TYPES } from "@/types/journal";

interface ReflectBubbleMenuProps {
  editor: Editor;
  markerPickerOpen: boolean;
  onClosePicker: () => void;
}

function getActiveMarkerType(editor: Editor): JournalMarkerType | null {
  const attrs = editor.getAttributes("journalMarker");
  const markerType = attrs.markerType;

  if (
    typeof markerType === "string" &&
    (JOURNAL_MARKER_TYPES as readonly string[]).includes(markerType)
  ) {
    return markerType as JournalMarkerType;
  }

  return null;
}

function finalizeMarker(editor: Editor, to: number) {
  editor
    .chain()
    .focus()
    .setTextSelection(to)
    .unsetMark("journalMarker")
    .run();
}

export function ReflectBubbleMenu({
  editor,
  markerPickerOpen,
  onClosePicker,
}: ReflectBubbleMenuProps) {
  const activeType = getActiveMarkerType(editor);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!markerPickerOpen) return;

    requestAnimationFrame(() => {
      firstButtonRef.current?.focus();
    });
  }, [markerPickerOpen]);

  useEffect(() => {
    const handleSelectionUpdate = () => {
      const { from, to, empty } = editor.state.selection;
      if (empty || from === to) {
        onClosePicker();
      }
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor, onClosePicker]);

  const applyMarker = (type: JournalMarkerType) => {
    const { from, to } = editor.state.selection;
    if (from === to) return;

    if (activeType) {
      editor
        .chain()
        .focus()
        .updateAttributes("journalMarker", { markerType: type })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .setMark("journalMarker", {
          markerId: crypto.randomUUID(),
          markerType: type,
        })
        .run();
    }

    finalizeMarker(editor, to);
    onClosePicker();
  };

  const removeMarker = () => {
    const { to } = editor.state.selection;

    editor.chain().focus().unsetMark("journalMarker").run();
    finalizeMarker(editor, to);
    onClosePicker();
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: currentEditor }) => {
        const { from, to } = currentEditor.state.selection;
        const hasSelection =
          from !== to && !currentEditor.state.selection.empty;
        return hasSelection || markerPickerOpen;
      }}
      className="reflect-bubble-menu"
    >
      {JOURNAL_MARKER_TYPES.map((type, index) => (
        <button
          key={type}
          ref={index === 0 ? firstButtonRef : undefined}
          type="button"
          data-type={type}
          className={cn(activeType === type && "is-active")}
          onClick={() => applyMarker(type)}
        >
          {getMarkerTypeLabel(type)}
        </button>
      ))}
      {activeType ? (
        <button
          type="button"
          className="reflect-bubble-menu__remove"
          onClick={removeMarker}
        >
          Remove
        </button>
      ) : null}
    </BubbleMenu>
  );
}
