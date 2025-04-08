import { RoomTypes } from "@alicarti/shared/rooms";
import { EchoRoom } from "./echo";
import { ChatRoom } from "./chat";
import { RPSRoom, type RPSRoomConfig } from "./rockpaperscissor";
import type { TopicInit } from "../libs/Topic";

const roomMap = {
  [RoomTypes.echo]: () => new EchoRoom(),
  [RoomTypes.chat]: () => new ChatRoom(),
  [RoomTypes.rockPaperScissor]: () => new RPSRoom(),
  [RoomTypes.broadcast]: () => null,
};

export class RoomFactory {
  static make<K extends keyof typeof RoomTypes>(type: K, config?: TopicInit) {
    const make = roomMap[type];
    const logic = make();
    if (logic && logic.hasSetup) {
      logic.setup(config);
    }
    return logic;
  }
}
