import type { ServerWebSocket } from "bun";
import type { Client, CommandInfo } from "@alicarti/shared";
import type { Topic, TopicClientsChangeResult } from "./Topic";
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

  /**
   * This returns whether a client has joined or not a topic
   * @param topic
   * @param ws
   * @returns TopicClientsChangeResult
   */
  joinTopic(
    topic: Topic,
    ws: ServerWebSocket<Client>
  ): TopicClientsChangeResult {
    if (this.#clients[ws.data.socketId].includes(topic.name)) {
      return {
        success: false,
        clientsCount: -1,
        reason: `${ws.data.socketId} already in ${topic.name}`,
      };
    }

    // Only join if not already in
    const result = topic.join(ws);

    // this would get false if there is a max client setup and joining would exceede it
    if (!result.success) {
      return result;
    }
    // add topic to the list of topics joined  the user
    if (this.#clients[ws.data.socketId]) {
      this.#clients[ws.data.socketId].push(topic.name);
      return result;
    }

    this.#clients[ws.data.socketId] = [topic.name];
    return result;
  }

  leaveTopic(
    topic: Topic,
    ws: ServerWebSocket<Client>
  ): TopicClientsChangeResult {
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
