import { RoomTypes, type RoomType } from "@alicarti/shared/rooms";
import { EchoRoom } from "./echo";
import type { StatefulRoom } from "./interfaces";

const roomMap: Record<RoomType, () => StatefulRoom<any> | null> = {
  [RoomTypes.echo]: () => new EchoRoom(),
  [RoomTypes.chat]: () => new EchoRoom(),
  [RoomTypes.broadcast]: () => null,
};

export class RoomFactory {
  static make(type: RoomType): StatefulRoom<any> | null {
    const make = roomMap[type];
    if (!make) return null;

    return make();
  }
}
