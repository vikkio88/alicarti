import {
  Commands,
  type Client,
  type CommandMessage,
  type CommandPayload,
  type ActionPayload,
  stateUpdate,
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
  const topic = ctx.topics.byName(action.roomId);
  if (!topic) {
    ctx.logger(`room ${action.roomId} does not exist`);
    return;
  }
  const room = ctx.topics.roomByName(action.roomId);
  if (!room) {
    ctx.logger(`room ${action.roomId} cannot handle ${action.action}`);
    return;
  }
  const newState = room.dispatch(action, ws, ctx);
  topic.publish(ctx.server!, stateUpdate(newState));
}
