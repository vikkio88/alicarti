import type { WebSocketHandler } from "bun";
import type { Client } from "@alicarti/shared";
import { parseMessage, setup, stateUpdate } from "@alicarti/shared";
import { Topic, TopicManager } from "../libs/Topic";
import { ClientsManager } from "../libs/ClientsManager";
import { availableCommands, messageHandler } from "../libs/messageHandler";
import { clientId } from "../libs/idGenerators";

const clientsManager = new ClientsManager();

const topicsManager = new TopicManager([new Topic("everyone")]);
const everyoneTopic = topicsManager.byName("everyone")!;

export type WsServerConfig = {
  log: (...strings: string[]) => void;
};

export const websocketServe = ({
  log = console.log,
}: WsServerConfig): WebSocketHandler<Client> => {
  return {
    async message(ws, msg) {
      log(`received message from ${ws.data.socketId}`);
      const message = parseMessage(msg as string);
      messageHandler(ws, message, {
        clients: clientsManager,
        topics: topicsManager,
      });
    },
    async open(ws) {
      log(`client connected: ${ws.data.socketId}`);
      clientsManager.onConnect(ws);
      clientsManager.joinTopic(everyoneTopic, ws);
      ws.send(setup({ ...ws.data }, { loggedIn: clientsManager.clientsCount }));
      everyoneTopic.publish(
        ws,
        stateUpdate({ loggedIn: clientsManager.clientsCount })
      );
    },
    async close(ws) {
      log(`client disconnected: ${ws.data.socketId}`);
      clientsManager.leaveTopic(everyoneTopic, ws);
      clientsManager.onDisconnect(ws);
      everyoneTopic.publish(
        ws,
        stateUpdate({ loggedIn: clientsManager.clientsCount })
      );
    },
  };
};

export function websocketUpgrade(): { data: Client } {
  const socketId = clientId();
  return {
    data: {
      createdAt: Date.now(),
      socketId,
      availableCommands,
    },
  };
}
