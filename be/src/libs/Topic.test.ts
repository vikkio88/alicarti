import { describe, expect, test } from "bun:test";
import { TopicManager, type TopicInit } from "./Topic";
import { RoomTypes } from "@alicarti/shared/rooms";
import type { EchoRoom } from "../rooms/echo";
import type { ServerWebSocket } from "bun";
import type { Client } from "@alicarti/shared";
import type { ServerContext } from "../servers/websocket";

const testInit = (name: string): TopicInit => ({
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

    const r = tm.roomLogicByName("ciao")! as EchoRoom;
    r.dispatch(
      { action: "shout", roomId: "ciao", data: { message: "ciao" } },
      {} as unknown as ServerWebSocket<Client>,
      { logger: () => {} } as unknown as ServerContext
    );

    expect(tm.roomLogicByName("ciao")).not.toEqual(tm.roomLogicByName("ciao1"));
  });
});
