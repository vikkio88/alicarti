import type { Server, ServerWebSocket } from "bun";
import type { ActionPayload, Client } from "@alicarti/shared";
import { RoomTypes, type RoomType } from "@alicarti/shared/rooms";
import type { StatefulRoom } from "../rooms/interfaces";
import { RoomFactory } from "../rooms/RoomFactory";

type TopicClientsUpdate = {
  clientsCount: number;
};

export class Topic {
  #name: string;
  #type: RoomType;
  #clients: string[];
  #clientsCanPublish: boolean;

  constructor(
    name: string,
    clientsCanPublish: boolean = false,
    type: RoomType = RoomTypes.broadcast
  ) {
    this.#name = name;
    this.#clients = [];
    this.#clientsCanPublish = clientsCanPublish;
    this.#type = type;
  }

  get clientsCount() {
    return this.#clients.length;
  }

  get name() {
    return this.#name;
  }

  get type() {
    return this.#type;
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
    ws: Server,
    message: string,
    isServer: boolean = true
  ) {
    if (isServer || this.#clientsCanPublish) {
      console.log(this.name, message);
      ws.publish(this.name, message);
    }
  }
}

export class TopicManager {
  // #server: ServerWebSocket<Client>;
  #topics: Record<string, Topic> = {};
  #topicsRoom: Record<string, StatefulRoom<any> | null> = {};

  constructor(topics: Topic[] = []) {
    // this.#server = server;
    for (const t of topics) this.#topics[t.name] = t;
  }

  create(name: string, clientsCanPublish: boolean, type: RoomType): Topic {
    this.#topics[name] = new Topic(name, clientsCanPublish, type);
    const room = RoomFactory.make(type);
    if (room) {
      this.#topicsRoom[name] = room;
    }

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

  roomByName<T>(name: string): StatefulRoom<T> | null {
    return this.#topicsRoom[name] ?? null;
  }

  getManyByName(topics: string[]): Topic[] {
    return topics.map((tName) => this.byName(tName)).filter((t) => t != null);
  }
}
