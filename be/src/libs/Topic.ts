import type { Server, ServerWebSocket } from "bun";
import type { Client } from "@alicarti/shared";
import { RoomTypes, type Room, type RoomType } from "@alicarti/shared/rooms";
import type { StatefulRoom } from "../rooms/StatefulRoom";
import { RoomFactory } from "../rooms/RoomFactory";

export type TopicClientsChangeResult = {
  success: boolean;
  clientsCount: number;
  reason?: string;
};

export type TopicConfig = {
  name: string;
  type: RoomType;
  admin?: string;
  adminClient?: Client;
  options: {
    clientsCanPublish: boolean;
    maxClients?: number;
  };
  config?: any;
};

export class Topic {
  #admin?: string;
  #name: string;
  #type: RoomType;
  #clients: string[];
  #options: {
    clientsCanPublish: boolean;
    maxClients?: number;
  };
  roomLogic?: StatefulRoom<any>;

  constructor(config: TopicConfig) {
    const {
      name,
      options,
      type = RoomTypes.broadcast,
      admin = undefined,
    } = config;
    this.#clients = [];
    this.#name = name;
    this.#type = type;
    this.#admin = admin;
    this.#options = options;
  }

  setRoomLogic<T>(room: StatefulRoom<T>) {
    this.roomLogic = room;
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

  join(ws: ServerWebSocket<Client>): TopicClientsChangeResult {
    if (
      this.#options.maxClients &&
      this.clientsCount + 1 > this.#options.maxClients
    ) {
      return {
        success: false,
        clientsCount: this.clientsCount,
        reason: `Room does not accept more clients, limit ${
          this.#options.maxClients
        }`,
      };
    }

    ws.subscribe(this.name);
    this.#clients.push(ws.data.socketId);
    return { clientsCount: this.#clients.length, success: true };
  }

  leave(ws: ServerWebSocket<Client>): TopicClientsChangeResult {
    ws.unsubscribe(this.name);
    this.#clients = this.#clients.filter((s) => s != ws.data.socketId);

    return { clientsCount: this.#clients.length, success: true };
  }

  publish(ws: Server, message: string, isServer: boolean = true) {
    if (isServer || this.#options.clientsCanPublish) {
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

  constructor(topics: Topic[] = []) {
    for (const t of topics) this.#topics[t.name] = t;
  }

  create(initConfig: TopicConfig): Topic {
    const name = initConfig.name;
    const newTopic = new Topic(initConfig);
    const room = RoomFactory.make(initConfig);
    if (room) {
      newTopic.setRoomLogic<any>(room);
    }
    this.#topics[name] = newTopic;

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
