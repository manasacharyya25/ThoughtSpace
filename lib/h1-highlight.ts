function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function splitH1WithTrailingHighlight(h1: string): {
  prefix: string;
  highlight: string;
} {
  const words = h1.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 1) {
    return { prefix: "", highlight: h1.trim() };
  }

  const hash = hashString(h1);
  const minHighlight = 2;
  const maxHighlight = Math.min(5, Math.max(minHighlight, words.length - 1));
  const highlightCount = minHighlight + (hash % (maxHighlight - minHighlight + 1));
  const safeCount = Math.min(highlightCount, words.length - 1);

  return {
    prefix: words.slice(0, -safeCount).join(" "),
    highlight: words.slice(-safeCount).join(" "),
  };
}
