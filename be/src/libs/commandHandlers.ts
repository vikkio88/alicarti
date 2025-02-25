import {
  cmdResult,
  Commands,
  isCommand,
  type Client,
  type CommandName,
  type WsMessage,
} from "@alicarti/shared";
import { ulid } from "ulid";
import type { ClientsManager } from "./ClientsManager";
import type { TopicManager } from "./Topic";
import type { ServerWebSocket } from "bun";

export function handleRoomCreation(
  ws: ServerWebSocket<Client>,
  serverContext: { clients: ClientsManager; topics: TopicManager }
) {
  const roomId = `r_${ulid()}`;
  const roomTopic = serverContext.topics.create(roomId, true);
  serverContext.clients.joinTopic(roomTopic, ws);
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
  serverContext: { clients: ClientsManager; topics: TopicManager }
) {
  if (!isCommand<{ roomId: string }>(commandMessage)) {
    return fail(ws, Commands.JOIN_ROOM);
  }

  if (!commandMessage.payload.data) {
    return fail(ws, Commands.JOIN_ROOM);
  }

  const roomId = commandMessage.payload.data.roomId;
  const roomTopic = serverContext.topics.byName(roomId);
  if (!roomTopic) {
    return fail(ws, Commands.JOIN_ROOM, { roomId });
  }

  serverContext.clients.joinTopic(roomTopic, ws);
  success(ws, Commands.JOIN_ROOM, { roomId });
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

function fail<T>(ws: ServerWebSocket<Client>, command: CommandName, data?: T) {
  ws.send(
    cmdResult({
      command,
      success: false,
      data,
    })
  );
}
