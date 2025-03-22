import {
  Commands,
  isCommandMessage,
  type Client,
  type CommandInfo,
  type WsMessage,
} from "@alicarti/shared";
import type { ServerWebSocket } from "bun";
import type { ClientsManager } from "./ClientsManager";
import type { TopicManager } from "./Topic";
import {
  handleRoomCreation,
  handleRoomJoining,
  handleRoomLeaving,
} from "./commandHandlers";
export const availableCommands: CommandInfo[] = [
  { name: Commands.CREATE_ROOM, description: "Create a room" },
  { name: Commands.JOIN_ROOM, description: "Join a room" },
];

export type ServerContext = {
  clients: ClientsManager;
  topics: TopicManager;
  logger: (msg: string) => void;
};

export function messageHandler(
  ws: ServerWebSocket<Client>,
  message: WsMessage<any>,
  ctx: ServerContext
) {
  if (isCommandMessage(message)) {
    const command = message.payload;
    switch (command.command) {
      case Commands.CREATE_ROOM: {
        handleRoomCreation(ws, message, ctx);
        break;
      }
      case Commands.JOIN_ROOM: {
        handleRoomJoining(ws, message, ctx);
        break;
      }
      case Commands.LEAVE_ROOM: {
        handleRoomLeaving(ws, message, ctx);
        break;
      }
    }
    return;
  }
}
