import type { RoomConfig } from "../configs";

export type EchoRoomState = {
  messages: string[];
  clients: number;
};

export interface EchoRoomConfig extends RoomConfig<EchoRoomState> {
  initialState: EchoRoomState;
}

export const echoRoomActions = ["shout"] as const;
export type EchoRoomActions = (typeof echoRoomActions)[number];

export type ShoutPayload = {
  msg: string;
};
