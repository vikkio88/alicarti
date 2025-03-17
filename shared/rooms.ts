export const RoomTypes = {
  echo: "echo",
  chat: "chat",
} as const;

export type RoomType = (typeof RoomTypes)[keyof typeof RoomTypes];

export type Room = {
  roomId: string;
  type: RoomType;
};
