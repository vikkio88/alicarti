import type { Client } from "@alicarti/shared";
import type { Room } from "@alicarti/shared/rooms";
export type RoomProps<T> = {
  room: Room;
  self: Client;
  initialState: T
};
