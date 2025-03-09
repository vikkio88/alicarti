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

  publish(
    ws: ServerWebSocket<Client>,
    message: string,
    isServer: boolean = true
  ) {
    if (isServer || this.#clientsCanPublish) {
      ws.publish(this.name, message);
    }
  }
}

export class TopicManager {
  #topics: Record<string, Topic> = {};
  constructor(topics: Topic[] = []) {
    for (const t of topics) this.#topics[t.name] = t;
  }

  create(name: string, clientsCanPublish: boolean): Topic {
    this.#topics[name] = new Topic(name, clientsCanPublish);
    return this.#topics[name];
  }

  byName(name: string): Topic | null {
    const topics = this.#topics;
    return topics[name] ?? null;
  }

  getManyByName(topics: string[]): Topic[] {
    return topics.map(this.byName).filter((t) => t != null);
  }
}
