export const BOARD_ROOM_ACCENTS = [
  { activeBg: "bg-[#EBF5FF]", activeBorder: "border-[#2F9CFA]", dot: "bg-[#2F9CFA]" },
  { activeBg: "bg-[#F3E8FF]", activeBorder: "border-[#B39DDB]", dot: "bg-[#B39DDB]" },
  { activeBg: "bg-[#FFF0EB]", activeBorder: "border-[#FFAB91]", dot: "bg-[#FFAB91]" },
  { activeBg: "bg-[#EDF0F1]", activeBorder: "border-[#1C1D1E]", dot: "bg-[#1C1D1E]" },
] as const;

export function getBoardRoomAccent(index: number) {
  return BOARD_ROOM_ACCENTS[index % BOARD_ROOM_ACCENTS.length];
}

export const COMING_SOON_ROOMS = [
  "Wonder",
  "Philosophy",
  "Late Night",
] as const;
