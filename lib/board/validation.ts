import { BOARD_MESSAGE_MAX_LENGTH } from "@/lib/board/constants";

export function validateBoardMessage(content: string): string | undefined {
  const trimmed = content.trim();

  if (!trimmed) {
    return "Write something before sending.";
  }

  if (trimmed.length > BOARD_MESSAGE_MAX_LENGTH) {
    return `Keep it under ${BOARD_MESSAGE_MAX_LENGTH} characters.`;
  }

  return undefined;
}
