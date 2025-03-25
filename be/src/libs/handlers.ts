import {
  Commands,
  type Client,
  type CommandMessage,
  type CommandPayload,
  type ActionPayload,
} from "@alicarti/shared";
import type { ServerWebSocket } from "bun";
import type { ServerContext } from "./messageHandler";
import {
  handleRoomCreation,
  handleRoomJoining,
  handleRoomLeaving,
} from "./commandHandlers";

export function handleCommand(
  command: CommandPayload<any>,
  ws: ServerWebSocket<Client>,
  message: CommandMessage<any>,
  ctx: ServerContext
) {
  switch (command.command) {
    case Commands.CREATE_ROOM: {
      handleRoomCreation(ws, command, ctx);
      return;
    }
    case Commands.JOIN_ROOM: {
      handleRoomJoining(ws, command, ctx);
      return;
    }
    case Commands.LEAVE_ROOM: {
      handleRoomLeaving(ws, command, ctx);
      return;
    }
  }
}

export function handleAction(
  action: ActionPayload<any>,
  ws: ServerWebSocket<Client>,
  ctx: ServerContext
) {
  ctx.logger(`${ws.data.socketId}: ${JSON.stringify(action.data)}`);
}
