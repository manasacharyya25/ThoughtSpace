"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { extractPlainText } from "@/lib/reflect/extract-plain-text";
import { JournalMarkerExtension } from "@/components/reflect/journal-marker-extension";
import { ReflectBubbleMenu } from "@/components/reflect/reflect-bubble-menu";
import { ReflectMarkerKeyboard } from "@/components/reflect/reflect-marker-keyboard";
import "@/components/reflect/reflect-editor-styles.css";

interface ReflectEditorProps {
  content: Record<string, unknown>;
  onSave: (
    contentJson: Record<string, unknown>,
    plainText: string
  ) => Promise<void>;
  onContentChange?: (
    contentJson: Record<string, unknown>,
    plainText: string
  ) => void;
  disabled?: boolean;
}

const SAVE_DEBOUNCE_MS = 1500;

export function ReflectEditor({
  content,
  onSave,
  onContentChange,
  disabled = false,
}: ReflectEditorProps) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSaveRef = useRef(onSave);
  const [markerPickerOpen, setMarkerPickerOpen] = useState(false);
  const markerPickerOpenRef = useRef(false);

  useEffect(() => {
    latestSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    markerPickerOpenRef.current = markerPickerOpen;
  }, [markerPickerOpen]);

  const openMarkerPicker = useCallback(() => {
    setMarkerPickerOpen(true);
  }, []);

  const closeMarkerPicker = useCallback(() => {
    setMarkerPickerOpen(false);
  }, []);

  const openPickerRef = useRef(openMarkerPicker);
  const closePickerRef = useRef(closeMarkerPicker);

  useEffect(() => {
    openPickerRef.current = openMarkerPicker;
    closePickerRef.current = closeMarkerPicker;
  }, [openMarkerPicker, closeMarkerPicker]);

  const queueSave = useCallback((json: Record<string, unknown>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const plainText = extractPlainText(json);
      void latestSaveRef.current(json, plainText);
    }, SAVE_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write freely — select text to mark insights, todos, and more.",
      }),
      JournalMarkerExtension,
      ReflectMarkerKeyboard.configure({
        onOpenPicker: () => openPickerRef.current(),
        onClosePicker: () => closePickerRef.current(),
        isPickerOpen: () => markerPickerOpenRef.current,
      }),
    ],
    content,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => {
      if (disabled) return;
      const json = currentEditor.getJSON() as Record<string, unknown>;
      const plainText = extractPlainText(json);
      onContentChange?.(json, plainText);
      queueSave(json);
    },
  });

  useEffect(() => {
    if (!editor || disabled) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor || !markerPickerOpen) return;

    editor.commands.focus();
  }, [editor, markerPickerOpen]);

  if (!editor) {
    return (
      <div className="reflect-editor min-h-[50vh] animate-pulse rounded-2xl bg-[#EDF0F1]/70" />
    );
  }

  return (
    <div className="reflect-editor">
      {!disabled ? (
        <ReflectBubbleMenu
          editor={editor}
          markerPickerOpen={markerPickerOpen}
          onClosePicker={closeMarkerPicker}
        />
      ) : null}
      <EditorContent editor={editor} />
    </div>
  );
}
