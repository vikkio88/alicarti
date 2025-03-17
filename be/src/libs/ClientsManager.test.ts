import { describe, expect, it, beforeEach } from "bun:test";
import type { ServerWebSocket } from "bun";
import type { Client } from "@alicarti/shared";
import { ClientsManager } from "./ClientsManager";
import type { Topic } from "./Topic";

class MockTopic {
  name: string;
  subscribers: Set<ServerWebSocket<Client>>;
  constructor(name: string) {
    this.name = name;
    this.subscribers = new Set();
  }
  subscribe(ws: ServerWebSocket<Client>) {
    this.subscribers.add(ws);
  }
  unsubscribe(ws: ServerWebSocket<Client>) {
    this.subscribers.delete(ws);
  }
}

describe("ClientsManager", () => {
  let clientsManager: ClientsManager;
  let mockWs: ServerWebSocket<Client>;
  let topic: Topic;

  beforeEach(() => {
    clientsManager = new ClientsManager();
    mockWs = { data: { socketId: "123" } } as ServerWebSocket<Client>;
    topic = new MockTopic("test-topic") as unknown as Topic;
  });

  it("should add a client on connect", () => {
    clientsManager.onConnect(mockWs);
    expect(clientsManager.clientsCount).toBe(1);
  });

  it("should remove a client on disconnect", () => {
    clientsManager.onConnect(mockWs);
    clientsManager.onDisconnect(mockWs);
    expect(clientsManager.clientsCount).toBe(0);
  });

  it("should allow a client to join a topic", () => {
    clientsManager.onConnect(mockWs);
    clientsManager.joinTopic(topic, mockWs);
    expect(clientsManager.getClientTopics(mockWs)).toContain("test-topic");
  });

  it("should allow a client to leave a topic", () => {
    clientsManager.onConnect(mockWs);
    clientsManager.joinTopic(topic, mockWs);
    clientsManager.leaveTopic(topic, mockWs);
    expect(clientsManager.getClientTopics(mockWs)).not.toContain("test-topic");
  });

  it("should return an empty array if a client has no topics", () => {
    clientsManager.onConnect(mockWs);
    expect(clientsManager.getClientTopics(mockWs)).toEqual([]);
  });

  it("should generate a new client object", () => {
    const client = ClientsManager.newClient();
    expect(client).toHaveProperty("socketId");
    expect(client).toHaveProperty("createdAt");
    expect(client).toHaveProperty("name");
    expect(client).toHaveProperty("availableCommands");
  });
});
