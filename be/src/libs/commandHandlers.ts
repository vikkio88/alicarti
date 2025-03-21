import {
  cmdResult,
  Commands,
  isCommandMessage,
  stateUpdate,
  type Client,
  type CommandName,
  type WsMessage,
} from "@alicarti/shared";
import type { ClientsManager } from "./ClientsManager";
import type { TopicManager } from "./Topic";
import type { ServerWebSocket } from "bun";
import { topicId } from "./idGenerators";
import type { ServerContext } from "./messageHandler";

export function handleRoomCreation(
  ws: ServerWebSocket<Client>,
  message: WsMessage<any>,
  ctx: ServerContext
) {
  const roomId = topicId();
  const roomTopic = ctx.topics.create(roomId, true);
  ctx.clients.joinTopic(roomTopic, ws);
  ctx.logger(`\tclient: ${ws.data.socketId} created room ${roomId}`);

  ws.send(
    cmdResult({
      command: Commands.CREATE_ROOM,
      success: true,
      data: { roomId },
    })
  );
}

export function handleRoomJoining(
  ws: ServerWebSocket<Client>,
  commandMessage: WsMessage<any>,
  ctx: ServerContext
) {
  if (!isCommandMessage<{ roomId: string }>(commandMessage)) {
    return failure(ws, Commands.JOIN_ROOM);
  }

  if (!commandMessage.payload.data) {
    return failure(ws, Commands.JOIN_ROOM);
  }

  const roomId = commandMessage.payload.data.roomId;
  const roomTopic = ctx.topics.byName(roomId);
  if (!roomTopic) {
    return failure(ws, Commands.JOIN_ROOM, { roomId });
  }

  ctx.clients.joinTopic(roomTopic, ws);
  ctx.logger(`\tclient: ${ws.data.socketId} joined room ${roomId}`);

  roomTopic.publish(
    ws,
    stateUpdate({ sender: "server", entry: `${ws.data.socketId} joined` })
  );
  success(ws, Commands.JOIN_ROOM, { roomId });
}

export function handleRoomLeaving(
  ws: ServerWebSocket<Client>,
  commandMessage: WsMessage<any>,
  ctx: ServerContext
) {
  if (!isCommandMessage<{ roomId: string }>(commandMessage)) {
    return failure(ws, Commands.LEAVE_ROOM);
  }

  if (!commandMessage.payload.data) {
    return failure(ws, Commands.LEAVE_ROOM);
  }

  const roomId = commandMessage.payload.data.roomId;
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
  } else {
    // otherwise notify the room about clients who left
    ctx.logger(
      `\tStill ${result.clientsCount} clients in room: ${roomId}, sending update.`
    );
    roomTopic.publish(
      ws,
      stateUpdate({ sender: "server", entry: `${ws.data.socketId} left` })
    );
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
