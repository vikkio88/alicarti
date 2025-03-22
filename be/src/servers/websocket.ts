import type { WebSocketHandler } from "bun";
import type { Client } from "@alicarti/shared";
import { parseMessage, setup, stateUpdate } from "@alicarti/shared";
import { Topic, TopicManager } from "../libs/Topic";
import { ClientsManager } from "../libs/ClientsManager";
import { messageHandler, type ServerContext } from "../libs/messageHandler";

const clientsManager = new ClientsManager();

const topicsManager = new TopicManager([new Topic("broadcast")]);
const broadcastTopic = topicsManager.byName("broadcast")!;

export type WsServerConfig = {
  log: (...strings: string[]) => void;
};

export const websocketServe = ({
  log = console.log,
}: WsServerConfig): WebSocketHandler<Client> => {
  
  const ctx: ServerContext = {
    clients: clientsManager,
    topics: topicsManager,
    logger: log,
  };

  return {
    async message(ws, msg) {
      const message = parseMessage(msg as string);
      ctx.logger(`received message "${message.type}" from ${ws.data.socketId}`);
      messageHandler(ws, message, ctx);
    },
    async open(ws) {
      ctx.logger(`client connected: ${ws.data.socketId}`);
      ctx.clients.onConnect(ws);
      ctx.clients.joinTopic(broadcastTopic, ws);
      ws.send(setup({ ...ws.data }, { loggedIn: ctx.clients.clientsCount }));
    },
    async close(ws) {
      ctx.logger(`client disconnected: ${ws.data.socketId}`);
      const topics = clientsManager.getClientTopics(ws);
      ctx.topics.getManyByName(topics).forEach((t) => {
        ctx.clients.leaveTopic(t, ws);
      });
      ctx.clients.onDisconnect(ws);
      broadcastTopic.publish(
        ws,
        stateUpdate({ loggedIn: clientsManager.clientsCount })
      );
    },
  };
};
