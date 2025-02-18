import type { Client } from "@alicarti/shared";
import type { WebSocketHandler } from "bun";
import { ulid } from "ulid";
import { message, setup, stateUpdate } from "../libs/messages";
import { Topic } from "../libs/Topic";

// let clients: Record<string, (keyof typeof topics)[]> = {};

const topics: Record<string, Topic> = {
  everyone: new Topic("everyone", false),
};

export type WsServerConfig = {
  log: (...strings: string[]) => void;
};

export const websocketServe = ({
  log = console.log,
}: WsServerConfig): WebSocketHandler<Client> => {
  return {
    async message(ws, msg) {
      log(`received message from ${ws.data.socketId}`);
      ws.send(message(`${ws.data.socketId}: ${msg}`));
    },
    async open(ws) {
      log(`client connected: ${ws.data.socketId}`);
      topics.everyone.subscribe(ws);
      ws.send(
        setup({ ...ws.data }, { loggedIn: topics.everyone.clientsCount })
      );
      topics.everyone.publish(
        ws,
        stateUpdate({ loggedIn: topics.everyone.clientsCount })
      );
    },
    async close(ws) {
      log(`client disconnected: ${ws.data.socketId}`);
      topics.everyone.unsubscribe(ws);
      topics.everyone.publish(
        ws,
        stateUpdate({ loggedIn: topics.everyone.clientsCount })
      );
    },
  };
};

export function websocketUpgrade(): { data: Client } {
  return {
    data: {
      createdAt: Date.now(),
      socketId: ulid().toString(),
    },
  };
}
