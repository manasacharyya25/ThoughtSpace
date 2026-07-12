import { generateHTML } from "@tiptap/html/server";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import { PullQuote } from "@/lib/tiptap/pull-quote";

/** Must stay in sync with ThoughtSpace Admin Console rich-text-editor extensions. */
const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
  }),
  PullQuote,
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
