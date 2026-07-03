import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";

const extensions = [
  StarterKit,
  Link.configure({ openOnClick: false }),
  Highlight,
  Underline,
];

type BlogRichContentProps = {
  doc: Record<string, unknown>;
};

export function BlogRichContent({ doc }: BlogRichContentProps) {
  const html = generateHTML(doc, extensions);

  return (
    <div
      className="prose-blog font-claude-response-body mt-10"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
