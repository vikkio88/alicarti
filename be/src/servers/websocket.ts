import { parseMessage, setup, type Client } from "@alicarti/shared";
import type { Server, ServerWebSocket } from "bun";
import { messageHandler } from "../libs/messageHandler";
import type { Topic, TopicManager } from "../libs/Topic";
import type { ClientsManager } from "../libs/ClientsManager";
import { BROADCAST_TOPIC_NAME } from "../const";

export type ServerContext = {
  clients: ClientsManager;
  topics: TopicManager;
  server?: Server;
  //TODO: change logger interface so it is logger {info, log, error, warn}
  logger: (msg: string) => void;
};

export function onMessage(
  ws: ServerWebSocket<Client>,
  msg: string | Buffer<ArrayBufferLike>,
  ctx: ServerContext
) {
  const message = parseMessage(msg as string);
  ctx.logger(`received message "${message.type}" from ${ws.data.socketId}`);
  messageHandler(ws, message, ctx);
}

export function onOpen(
  ws: ServerWebSocket<Client>,
  ctx: ServerContext,
  broadcast: Topic
) {
  ctx.logger(`client connected: ${ws.data.socketId}`);
  ctx.clients.onConnect(ws);
  ctx.clients.joinTopic(broadcast, ws);
  ws.send(setup({ ...ws.data }));
}

export function onClose(ws: ServerWebSocket<Client>, ctx: ServerContext) {
  ctx.logger(`client disconnected: ${ws.data.socketId}`);
  const topics = ctx.clients.getClientTopics(ws);
  //TODO: handle the room clear-up from here too
  ctx.topics.getManyByName(topics).forEach((t) => {
    const result = ctx.clients.leaveTopic(t, ws);
    if (t.name !== BROADCAST_TOPIC_NAME && result.clientsCount < 1) {
      // if there are no more clients left removing the room
      ctx.logger(`\tNo more clients in room: ${t.name}, removing it.`);
      ctx.topics.remove(t.name);
    }
  });
  ctx.clients.onDisconnect(ws);
}
