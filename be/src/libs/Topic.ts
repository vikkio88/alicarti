import type { ServerWebSocket } from "bun";
import type { Client } from "@alicarti/shared";

type TopicClientsUpdate = {
  clientsCount: number;
};

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

  join(ws: ServerWebSocket<Client>): TopicClientsUpdate {
    ws.subscribe(this.name);
    this.#clients.push(ws.data.socketId);
    return { clientsCount: this.#clients.length };
  }

  leave(ws: ServerWebSocket<Client>): TopicClientsUpdate {
    ws.unsubscribe(this.name);
    this.#clients = this.#clients.filter((s) => s != ws.data.socketId);

    return { clientsCount: this.#clients.length };
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

  remove(name: string): boolean {
    const topic = this.byName(name);
    if (!topic) return false;
    delete this.#topics[name];
    return true;
  }

  byName(name: string): Topic | null {
    return this.#topics[name] ?? null;
  }

  getManyByName(topics: string[]): Topic[] {
    return topics.map((tName) => this.byName(tName)).filter((t) => t != null);
  }
}
