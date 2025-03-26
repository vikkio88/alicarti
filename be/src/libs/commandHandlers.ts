import {
  cmdResult,
  Commands,
  isCommandMessage,
  stateUpdate,
  type Client,
  type CommandName,
  type CommandPayload,
  type WsMessage,
} from "@alicarti/shared";
import type { ServerWebSocket } from "bun";
import { topicId } from "./idGenerators";
import type { ServerContext } from "./messageHandler";

export function handleRoomCreation(
  ws: ServerWebSocket<Client>,
  payload: CommandPayload<any>,
  ctx: ServerContext
) {
  if (!payload.data || !payload.data.roomType) {
    failure(ws, Commands.CREATE_ROOM);
    return;
  }
  const roomId = topicId();
  const roomType = payload.data.roomType;
  const roomTopic = ctx.topics.create(roomId, true, roomType);
  ctx.clients.joinTopic(roomTopic, ws);
  ctx.logger(
    `\tclient: ${ws.data.socketId} created room ${roomId}, type: ${payload.data.roomType}}`
  );

  success(ws, Commands.CREATE_ROOM, { id: roomId, type: roomType });
}

export function handleRoomJoining(
  ws: ServerWebSocket<Client>,
  payload: CommandPayload<any>,
  ctx: ServerContext
) {
  if (!payload.data) {
    return failure(ws, Commands.JOIN_ROOM);
  }

  const roomId = payload.data.roomId;
  const roomTopic = ctx.topics.byName(roomId);
  if (!roomTopic) {
    return failure(ws, Commands.JOIN_ROOM, { roomId });
  }

  ctx.clients.joinTopic(roomTopic, ws);
  ctx.logger(`\tclient: ${ws.data.socketId} joined room ${roomId}`);
  success(ws, Commands.JOIN_ROOM, { id: roomId, type: roomTopic.type });
}

export function handleRoomLeaving(
  ws: ServerWebSocket<Client>,
  payload: CommandPayload<any>,
  ctx: ServerContext
) {
  if (!payload.data) {
    return failure(ws, Commands.LEAVE_ROOM);
  }

  const roomId = payload.data.roomId;
  const roomTopic = ctx.topics.byName(roomId);
  if (!roomTopic) {
    return failure(ws, Commands.LEAVE_ROOM, { roomId });
  }

  const result = ctx.clients.leaveTopic(roomTopic, ws);
  ctx.logger(`\tclient: ${ws.data.socketId} left room ${roomId}`);

  if (result.clientsCount < 1) {
    // if there are no more clients left removing the room
    ctx.logger(`\tNo more clients in room: ${roomId}, removing it.`);
    ctx.topics.remove(roomId);
  }

  success(ws, Commands.LEAVE_ROOM, { roomId });
}

function success<T>(
  ws: ServerWebSocket<Client>,
  command: CommandName,
  data?: T
) {
  ws.send(
    cmdResult({
      command,
      success: true,
      data,
    })
  );
}

function failure<T>(
  ws: ServerWebSocket<Client>,
  command: CommandName,
  data?: T
) {
  ws.send(
    cmdResult({
      command,
      success: false,
      data,
    })
  );
}
