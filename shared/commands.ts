import type { Room } from "./rooms";

export type CommandInfo = {
  name: string;
  description: string;
};

export const Commands = {
  CREATE_ROOM: "CREATE_ROOM",
  JOIN_ROOM: "JOIN_ROOM",
  LEAVE_ROOM: "LEAVE_ROOM",
} as const;

export type CommandName = (typeof Commands)[keyof typeof Commands];

export type JoinedRoomResponsePayload<T> = {
  room: Room;
  initialState: T;
};
