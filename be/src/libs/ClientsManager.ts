import type { ServerWebSocket } from "bun";
import type { Client } from "@alicarti/shared";
import type { Topic } from "./Topic";

export class ClientsManager {
  #clients: Record<string, string[]>;

  constructor() {
    this.#clients = {};
  }

  get clientsCount() {
    return Object.keys(this.#clients).length;
  }

  joinTopic(topic: Topic, ws: ServerWebSocket<Client>) {
    topic.subscribe(ws);
    if (this.#clients[ws.data.socketId]) {
      this.#clients[ws.data.socketId].push(topic.name);
    }
  }

  leaveTopic(topic: Topic, ws: ServerWebSocket<Client>, leavingAll = false) {
    topic.unsubscribe(ws);
    if (leavingAll) return;
    
    if (this.#clients[ws.data.socketId]) {
      this.#clients[ws.data.socketId] = this.#clients[ws.data.socketId].filter(
        (tName) => tName != topic.name
      );
    }
  }

  onConnect(ws: ServerWebSocket<Client>) {
    this.#clients[ws.data.socketId] = [];
  }

  onDisconnect(ws: ServerWebSocket<Client>) {
    delete this.#clients[ws.data.socketId];
  }

  getClientTopics(ws: ServerWebSocket<Client>): string[] {
    return this.#clients[ws.data.socketId] ?? [];
  }
}
