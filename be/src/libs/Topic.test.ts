import { describe, expect, test } from "bun:test";
import { TopicManager } from "./Topic";
import { RoomTypes } from "@alicarti/shared/rooms";
import type { EchoRoom } from "../rooms/echo";
import type { ServerWebSocket } from "bun";
import type { Client } from "@alicarti/shared";
import type { ServerContext } from "../servers/websocket";

describe("Topic Manager", () => {
  test("generation with state is not the same", () => {
    const tm = new TopicManager();

    tm.create("ciao", true, RoomTypes.echo);
    tm.create("ciao1", true, RoomTypes.echo);

    const r = tm.roomByName("ciao")! as EchoRoom;
    r.dispatch(
      { action: "shout", roomId: "ciao", data: { message: "ciao" } },
      {} as unknown as ServerWebSocket<Client>,
      { logger: () => {} } as unknown as ServerContext
    );

    expect(tm.roomByName("ciao")).not.toEqual(tm.roomByName("ciao1"));
  });
});
