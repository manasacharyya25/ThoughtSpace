export const BOARD_ROOM_ACCENTS = [
  {
    activeBg: "bg-[#EBF5FF]",
    activeBorder: "border-[#2F9CFA]",
    dot: "bg-[#2F9CFA]",
  },
  {
    activeBg: "bg-white",
    activeBorder: "border-[#2F9CFA]/35",
    dot: "bg-[#2F9CFA]/80",
  },
  {
    activeBg: "bg-[#EDF0F1]",
    activeBorder: "border-[#2F9CFA]/20",
    dot: "bg-[#1C1D1E]/25",
  },
] as const;

export function getBoardRoomAccent(index: number) {
  return BOARD_ROOM_ACCENTS[index % BOARD_ROOM_ACCENTS.length];
}

export const COMING_SOON_ROOMS = [
  "Wonder",
  "Philosophy",
  "Late Night",
] as const;
