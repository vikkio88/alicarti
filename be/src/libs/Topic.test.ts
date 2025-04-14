import { describe, expect, test } from "bun:test";
import { TopicManager, type TopicConfig } from "./Topic";
import { RoomTypes } from "@alicarti/shared/rooms";
import type { EchoRoom } from "../rooms/echo";
import type { ServerWebSocket } from "bun";
import type { Client } from "@alicarti/shared";
import type { ServerContext } from "../servers/websocket";

const testInit = (name: string): TopicConfig => ({
  name,
  type: RoomTypes.echo,
  admin: "none",
  options: {
    clientsCanPublish: false,
  },
});

describe("Topic Manager", () => {
  test("generation with state is not the same", () => {
    const tm = new TopicManager();

    tm.create(testInit("ciao"));
    tm.create(testInit("ciao1"));

    const r = tm.byName("ciao")?.roomLogic! as EchoRoom;
    r.dispatch(
      { action: "shout", roomId: "ciao", data: { message: "ciao" } },
      {} as unknown as ServerWebSocket<Client>,
      { logger: () => {} } as unknown as ServerContext
    );

    expect(tm.byName("ciao")?.roomLogic).not.toEqual(tm.byName("ciao1")?.roomLogic);
  });
});
