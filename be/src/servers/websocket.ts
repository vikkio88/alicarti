import type { Client } from "@alicarti/shared";
import type { WebSocketHandler } from "bun";
import { ulid } from "ulid";

export const websocketServe: WebSocketHandler<Client> = {
  async message(ws, message) {
    ws.send(`${ws.data.socketId}: ${message}`);
  },
  async open(ws) {
    console.log("a client connected", ws.data.socketId);
    ws.send(JSON.stringify({ type: "setup", payload: { ...ws.data } }));
    ws.subscribe("all");
  },
  async close(ws) {
    console.log("a client disconnected", ws.data.socketId);
    ws.unsubscribe("all");
  },
};

export function websocketUpgrade(): { data: Client } {
  return {
    data: {
      createdAt: Date.now(),
      socketId: ulid().toString(),
    },
  };
}
