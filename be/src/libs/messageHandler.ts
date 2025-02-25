import {
  Commands,
  isCommand,
  type Client,
  type CommandInfo,
  type WsMessage,
} from "@alicarti/shared";
import type { ServerWebSocket } from "bun";
import type { ClientsManager } from "./ClientsManager";
import type { TopicManager } from "./Topic";
import { handleRoomCreation, handleRoomJoining } from "./commandHandlers";
export const availableCommands: CommandInfo[] = [
  { name: Commands.CREATE_ROOM, description: "Create a room" },
  { name: Commands.JOIN_ROOM, description: "Join a room" },
];

export function messageHandler(
  ws: ServerWebSocket<Client>,
  message: WsMessage<any>,
  serverContext: {
    clients: ClientsManager;
    topics: TopicManager;
  }
) {
  if (isCommand(message)) {
    switch (message.payload.command as keyof typeof Commands) {
      case Commands.CREATE_ROOM: {
        handleRoomCreation(ws, serverContext);
        break;
      }
      case Commands.JOIN_ROOM: {
        handleRoomJoining(ws, message, serverContext);
        break;
      }
    }
    return;
  }
}
