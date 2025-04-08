import {
  Commands,
  isCommandMessage,
  isActionMessage,
  type Client,
  type CommandInfo,
  type WsMessage,
} from "@alicarti/shared";
import type { ServerWebSocket } from "bun";
import { handleAction, handleCommand } from "./handlers";
import type { ServerContext } from "../servers/websocket";
export const availableCommands: CommandInfo[] = [
  { name: Commands.CREATE_ROOM, description: "Create a room" },
  { name: Commands.JOIN_ROOM, description: "Join a room" },
];

export function messageHandler(
  ws: ServerWebSocket<Client>,
  message: WsMessage<any>,
  ctx: ServerContext
) {
  if (isCommandMessage(message)) {
    const command = message.payload;
    handleCommand(command, ws, ctx);
    return;
  }

  if (isActionMessage(message)) {
    const action = message.payload;
    handleAction(action, ws, ctx);
  }
}
