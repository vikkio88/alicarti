import { RoomTypes } from "@alicarti/shared/rooms";
import { EchoRoom } from "./echo";
import { ChatRoom } from "./chat";
import { RPSRoom } from "./rockpaperscissor";
import type { TopicConfig } from "../libs/Topic";

const roomMap = {
  [RoomTypes.echo]: (topicName: string) => new EchoRoom(topicName),
  [RoomTypes.chat]: (topicName: string) => new ChatRoom(topicName),
  [RoomTypes.rockPaperScissor]: (topicName: string) => new RPSRoom(topicName),
  [RoomTypes.broadcast]: () => null,
};

export class RoomFactory {
  static make(config: TopicConfig) {
    const make = roomMap[config.type];
    const logic = make(config?.name ?? "");
    if (logic && logic.hasSetup) {
      logic.setup(config);
    }
    return logic;
  }
}
