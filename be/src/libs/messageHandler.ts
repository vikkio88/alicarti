import {
  isCommand,
  type Client,
  type Command,
  type WsMessage,
} from "@alicarti/shared";
import type { ServerWebSocket } from "bun";
import type { ClientsManager } from "./ClientsManager";
import type { TopicManager } from "./Topic";
import { handleRoomCreation } from "./commandHandlers";

export const Commands = {
  CREATE_ROOM: "create_room",
};

export const availableCommands: Command[] = [
  { name: Commands.CREATE_ROOM, description: "Create a room" },
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
    }
    return;
  }
}
