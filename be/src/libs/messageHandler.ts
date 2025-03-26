import {
  Commands,
  isCommandMessage,
  isActionMessage,
  type Client,
  type CommandInfo,
  type WsMessage,
} from "@alicarti/shared";
import type { ServerWebSocket } from "bun";
import type { ClientsManager } from "./ClientsManager";
import type { TopicManager } from "./Topic";
import { handleAction, handleCommand } from "./handlers";
export const availableCommands: CommandInfo[] = [
  { name: Commands.CREATE_ROOM, description: "Create a room" },
  { name: Commands.JOIN_ROOM, description: "Join a room" },
];

export type ServerContext = {
  clients: ClientsManager;
  topics: TopicManager;
  server?: ReturnType<typeof Bun.serve>;
  logger: (msg: string) => void;
};

export function messageHandler(
  ws: ServerWebSocket<Client>,
  message: WsMessage<any>,
  ctx: ServerContext
) {
  if (isCommandMessage(message)) {
    const command = message.payload;
    handleCommand(command, ws, message, ctx);
    return;
  }

  if (isActionMessage(message)) {
    const action = message.payload;
    handleAction(action, ws, ctx);
  }
}
