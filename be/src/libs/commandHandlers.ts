import {
  cmdResult,
  Commands,
  type JoinedRoomResponsePayload,
  type Client,
  type CommandName,
  type CommandPayload,
} from "@alicarti/shared";
import type { ServerContext } from "../servers/websocket";
import type { ServerWebSocket } from "bun";
import { topicId } from "./idGenerators";

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

  const adminId = ws.data.socketId;

  const roomTopic = ctx.topics.create({
    name: roomId,
    admin: adminId,
    adminClient: ws.data,
    type: roomType,
    options: {
      clientsCanPublish: false,
      // maxClients: 2, SETUP MAX CLIENTS
    },
    config: { ...payload.data.config },
  });
  const roomLogic = roomTopic.roomLogic;
  const result = ctx.clients.joinTopic(roomTopic, ws);

  ctx.logger(
    `\tclient: ${ws.data.socketId} created room ${roomId}, type: ${payload.data.roomType}}`
  );
  if (result.success) {
    success<JoinedRoomResponsePayload<any>>(ws, Commands.CREATE_ROOM, {
      room: roomTopic.room(),
      initialState: roomLogic?.state,
    });
    return;
  }

  ctx.logger(
    `client: ${ws.data.socketId} could not join the room, reason: "${
      result.reason ?? "Unknown"
    }"`
  );
  failure(ws, Commands.CREATE_ROOM);
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

  const result = ctx.clients.joinTopic(roomTopic, ws);
  if (result.success) {
    const roomLogic = roomTopic.roomLogic;
    roomLogic?.onJoin(ws.data, ctx);
    ctx.logger(`\tclient: ${ws.data.socketId} joined room ${roomId}`);
    success<JoinedRoomResponsePayload<any>>(ws, Commands.JOIN_ROOM, {
      room: roomTopic.room(),
      initialState: roomLogic?.state,
    });
    return;
  }

  ctx.logger(
    `client: ${ws.data.socketId} could not join the room, reason: "${
      result.reason ?? "Unknown"
    }"`
  );
  failure(ws, Commands.JOIN_ROOM);
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
  } else {
    // only trigger the onLeave if there is someone left
    const roomLogic = roomTopic.roomLogic;
    roomLogic?.onLeave(ws.data, ctx);
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
