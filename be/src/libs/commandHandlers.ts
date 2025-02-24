import { cmdResult, type Client } from "@alicarti/shared";
import { ulid } from "ulid";
import { Commands } from "./messageHandler";
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
      payload: { roomId },
    })
  );
}
