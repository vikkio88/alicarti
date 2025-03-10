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

export function handleRoomCreation(
  ws: ServerWebSocket<Client>,
  message: WsMessage<any>,
  serverContext: { clients: ClientsManager; topics: TopicManager }
) {
  const roomId = topicId();
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
  if (!isCommandMessage<{ roomId: string }>(commandMessage)) {
    return failure(ws, Commands.JOIN_ROOM);
  }

  if (!commandMessage.payload.data) {
    return failure(ws, Commands.JOIN_ROOM);
  }

  const roomId = commandMessage.payload.data.roomId;
  const roomTopic = serverContext.topics.byName(roomId);
  if (!roomTopic) {
    return failure(ws, Commands.JOIN_ROOM, { roomId });
  }

  serverContext.clients.joinTopic(roomTopic, ws);

  roomTopic.publish(
    ws,
    stateUpdate({ sender: "server", entry: `${ws.data.socketId} joined` })
  );
  success(ws, Commands.JOIN_ROOM, { roomId });
}

export function handleRoomLeaving(
  ws: ServerWebSocket<Client>,
  commandMessage: WsMessage<any>,
  serverContext: { clients: ClientsManager; topics: TopicManager }
) {
  if (!isCommandMessage<{ roomId: string }>(commandMessage)) {
    return failure(ws, Commands.LEAVE_ROOM);
  }

  if (!commandMessage.payload.data) {
    return failure(ws, Commands.LEAVE_ROOM);
  }

  const roomId = commandMessage.payload.data.roomId;
  const roomTopic = serverContext.topics.byName(roomId);
  if (!roomTopic) {
    return failure(ws, Commands.LEAVE_ROOM, { roomId });
  }

  serverContext.clients.leaveTopic(roomTopic, ws);
  //TODO: add way to remove topic if no clients left

  roomTopic.publish(
    ws,
    stateUpdate({ sender: "server", entry: `${ws.data.socketId} left` })
  );
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
