import type { Client } from "@alicarti/shared";
import type { WebSocketHandler } from "bun";
import { ulid } from "ulid";
import { message, setup, stateUpdate } from "../libs/messages";
let clients: string[] = [];

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
      clients.push(ws.data.socketId);
      ws.subscribe("all");
      ws.send(setup({ ...ws.data }, { loggedIn: clients.length }));
      ws.publish("all", stateUpdate({ loggedIn: clients.length }));
    },
    async close(ws) {
      log(`client disconnected: ${ws.data.socketId}`);
      clients = clients.filter((c) => c != ws.data.socketId);
      ws.unsubscribe("all");
      ws.publish("all", stateUpdate({ loggedIn: clients.length }));
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
