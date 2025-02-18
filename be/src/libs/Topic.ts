import type { ServerWebSocket } from "bun";
import type { Client } from "@alicarti/shared";

export class Topic {
  #name: string;
  #clients: string[];
  #clientsCanPublish: boolean;
  constructor(name: string, clientsCanPublish: boolean = false) {
    this.#name = name;
    this.#clients = [];
    this.#clientsCanPublish = clientsCanPublish;
  }

  get clientsCount() {
    return this.#clients.length;
  }

  get name() {
    return this.#name;
  }

  subscribe(ws: ServerWebSocket<Client>) {
    ws.subscribe(this.name);
    this.#clients.push(ws.data.socketId);
  }

  unsubscribe(ws: ServerWebSocket<Client>) {
    ws.unsubscribe(this.name);
    this.#clients = this.#clients.filter((s) => s != ws.data.socketId);
  }

  publish(ws: ServerWebSocket<Client>, message: string) {
    ws.publish(this.name, message);
  }
}
