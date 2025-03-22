import { describe, expect, it, beforeEach, spyOn } from "bun:test";
import { Topic, TopicManager } from "./Topic";
import type { Client } from "@alicarti/shared";
import type { ServerWebSocket } from "bun";

describe("Topic", () => {
  let topic: Topic;
  let ws1: ServerWebSocket<Client>, ws2: ServerWebSocket<Client>;
  beforeEach(() => {
    topic = new Topic("test-topic");
    ws1 = {
      data: { socketId: "client1" },
      subscribe: () => {},
      unsubscribe: () => {},
      publish: () => {},
    } as unknown as ServerWebSocket<Client>;

    ws2 = {
      data: { socketId: "client2" },
      subscribe: () => {},
      unsubscribe: () => {},
      publish: () => {},
    } as unknown as ServerWebSocket<Client>;
  });

  it("should initialize correctly", () => {
    expect(topic.name).toBe("test-topic");
    expect(topic.clientsCount).toBe(0);
  });

  it("should allow clients to join", () => {
    const result = topic.join(ws1);
    expect(result.clientsCount).toBe(1);
    expect(topic.clientsCount).toBe(1);
  });

  it("should allow multiple clients to join", () => {
    topic.join(ws1);
    const result = topic.join(ws2);
    expect(result.clientsCount).toBe(2);
    expect(topic.clientsCount).toBe(2);
  });

  it("should allow clients to leave", () => {
    topic.join(ws1);
    topic.join(ws2);
    const result = topic.leave(ws1);
    expect(result.clientsCount).toBe(1);
    expect(topic.clientsCount).toBe(1);
  });

  it("should prevent non-existent clients from affecting count on leave", () => {
    const result = topic.leave(ws1);
    expect(result.clientsCount).toBe(0);
  });

  it("should allow publishing if server", () => {
    const spy = spyOn(ws1, "publish");
    topic.publish(ws1, "hello", true);
    expect(spy).toHaveBeenCalledWith("test-topic", "hello");
  });
});

describe("TopicManager", () => {
  let manager: TopicManager;

  beforeEach(() => {
    manager = new TopicManager();
  });

  it("should create a topic", () => {
    const topic = manager.create("new-topic", false);
    expect(topic.name).toBe("new-topic");
    expect(manager.byName("new-topic")).toBe(topic);
  });

  it("should remove a topic", () => {
    manager.create("removable-topic", false);
    const result = manager.remove("removable-topic");
    expect(result).toBe(true);
    expect(manager.byName("removable-topic")).toBe(null);
  });

  it("should return null for non-existent topics", () => {
    expect(manager.byName("non-existent")).toBe(null);
  });

  it("should get multiple topics by name", () => {
    manager.create("topic1", false);
    manager.create("topic2", false);
    const topics = manager.getManyByName(["topic1", "topic2", "topic3"]);
    expect(topics.length).toBe(2);
  });
});
