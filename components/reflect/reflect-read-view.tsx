import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { JournalMarkerExtension } from "@/components/reflect/journal-marker-extension";
import "@/components/reflect/reflect-editor-styles.css";

const extensions = [StarterKit, JournalMarkerExtension];

interface ReflectReadViewProps {
  doc: Record<string, unknown>;
}

export function ReflectReadView({ doc }: ReflectReadViewProps) {
  const html = generateHTML(doc, extensions);

  return (
    <div
      className="reflect-read-view"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
