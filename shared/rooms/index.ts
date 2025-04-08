export const RoomTypes = {
  broadcast: "broadcast",
  echo: "echo",
  chat: "chat",
  rockPaperScissor: "rockPaperScissor",
} as const;

export type RoomType = (typeof RoomTypes)[keyof typeof RoomTypes];

export type Room = {
  id: string;
  admin?: string;
  type: RoomType;
};
