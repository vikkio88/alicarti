import type { ServerWebSocket } from "bun";
import type { Client, CommandInfo } from "@alicarti/shared";
import type { Topic } from "./Topic";
import { clientId } from "./idGenerators";
import type { RoomType } from "@alicarti/shared/rooms";
import { r } from "./singletons";
import { ANIMALS, COLORS } from "../data/names";

export class ClientsManager {
  #clients: Record<string, string[]>;

  constructor() {
    this.#clients = {};
  }

  get clientsCount() {
    return Object.keys(this.#clients).length;
  }

  joinTopic(topic: Topic, ws: ServerWebSocket<Client>) {
    topic.join(ws);

    // add topic to the list of topics joined  the user
    if (this.#clients[ws.data.socketId]) {
      this.#clients[ws.data.socketId].push(topic.name);
      return;
    }

    this.#clients[ws.data.socketId] = [topic.name];
  }

  leaveTopic(topic: Topic, ws: ServerWebSocket<Client>) {
    const result = topic.leave(ws);

    // remove topic from list of topics a client joined
    if (this.#clients[ws.data.socketId]) {
      this.#clients[ws.data.socketId] = this.#clients[ws.data.socketId].filter(
        (tName) => tName != topic.name
      );
    }

    return result;
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

  static newClient(
    availableRooms: RoomType[],
    availableCommands: CommandInfo[]
  ): Client {
    return {
      socketId: clientId(),
      createdAt: Date.now(),
      name: generateName(),
      availableCommands,
      availableRooms,
    };
  }
}

function generateName() {
  return `${r.pickOne(COLORS)}_${r.pickOne(ANIMALS)}_${r.int(1, 100)}`;
}
