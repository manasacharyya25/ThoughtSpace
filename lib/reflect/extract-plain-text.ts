type TipTapNode = {
  type?: string;
  text?: string;
  content?: TipTapNode[];
};

function walkNode(node: TipTapNode, parts: string[]) {
  if (node.type === "text" && node.text) {
    parts.push(node.text);
    return;
  }

  if (node.type === "hardBreak") {
    parts.push("\n");
    return;
  }

  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      walkNode(child, parts);
    }

    if (node.type === "paragraph" || node.type === "heading") {
      parts.push("\n");
    }
  }
}

export function extractPlainText(doc: Record<string, unknown>): string {
  const parts: string[] = [];
  walkNode(doc as TipTapNode, parts);
  return parts.join("").replace(/\n+$/, "").trim();
}
