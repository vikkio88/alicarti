import type { Client } from "../../Client";
import type { ActionPayload } from "../../ws";
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

export function actionsHandler(
  client: Client,
  currentState: EchoRoomState,
  action: ActionPayload<ShoutPayload>
): EchoRoomState {
  if (action.data?.msg) {
    const msg = `${client.socketId}: ${action.data.msg}`;
    const echo = `room: ${action.data.msg}`;
    currentState.messages = [...currentState.messages, msg, echo];
  }
  return currentState;
}
