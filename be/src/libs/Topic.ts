import type { Server, ServerWebSocket } from "bun";
import type { ActionPayload, Client } from "@alicarti/shared";
import { RoomTypes, type Room, type RoomType } from "@alicarti/shared/rooms";
import type { StatefulRoom } from "../rooms/StatefulRoom";
import { RoomFactory } from "../rooms/RoomFactory";

type TopicClientsUpdate = {
  clientsCount: number;
};

export type TopicInit = {
  name: string;
  type: RoomType;
  admin?: string;
  options: {
    clientsCanPublish: boolean;
  };
};

export class Topic {
  #admin?: string;
  #name: string;
  #type: RoomType;
  #clients: string[];
  #clientsCanPublish: boolean;

  constructor(config: TopicInit) {
    const {
      name,
      options: { clientsCanPublish },
      type = RoomTypes.broadcast,
      admin = undefined,
    } = config;
    this.#clients = [];
    this.#name = name;
    this.#type = type;
    this.#admin = admin;
    this.#clientsCanPublish = clientsCanPublish;
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

  publish(ws: Server, message: string, isServer: boolean = true) {
    if (isServer || this.#clientsCanPublish) {
      console.log(this.name, message);
      ws.publish(this.name, message);
    }
  }

  room(): Room {
    return {
      id: this.#name,
      type: this.#type,
      admin: this.#admin,
    };
  }
}

export class TopicManager {
  #topics: Record<string, Topic> = {};
  #topicsRoomLogic: Record<string, StatefulRoom<any> | null> = {};

  constructor(topics: Topic[] = []) {
    for (const t of topics) this.#topics[t.name] = t;
  }

  create(config: TopicInit): Topic {
    const name = config.name;
    this.#topics[name] = new Topic(config);
    const room = RoomFactory.make(config.type);
    if (room) {
      this.#topicsRoomLogic[name] = room;
    }

    return this.#topics[name];
  }

  remove(name: string): boolean {
    const topic = this.byName(name);
    if (!topic) return false;
    delete this.#topics[name];

    if (this.#topicsRoomLogic[name]) {
      delete this.#topicsRoomLogic[name];
    }

    return true;
  }

  byName(name: string): Topic | null {
    return this.#topics[name] ?? null;
  }

  roomLogicByName<T>(name: string): StatefulRoom<T> | null {
    return this.#topicsRoomLogic[name] ?? null;
  }

  getManyByName(topics: string[]): Topic[] {
    return topics.map((tName) => this.byName(tName)).filter((t) => t != null);
  }
}
