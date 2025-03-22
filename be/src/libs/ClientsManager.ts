import type { ServerWebSocket } from "bun";
import type { Client, CommandInfo, RoomType } from "@alicarti/shared";
import type { Topic } from "./Topic";
import { clientId } from "./idGenerators";

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
    if (this.#clients[ws.data.socketId]) {
      this.#clients[ws.data.socketId].push(topic.name);
    }
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
      name: "",
      availableCommands,
      availableRooms,
    };
  }
}
