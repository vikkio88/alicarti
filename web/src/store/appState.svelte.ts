import type { Client } from "@alicarti/shared";
import type { Room } from "@alicarti/shared/rooms";

type AppState = {
  roomId?: string;
  socketId?: string;
};

let s: AppState = $state({
  roomId: undefined,
  socketId: undefined,
});

export const appState = {
  get roomId() {
    return s.roomId;
  },
  get socketId() {
    return s.socketId;
  },
  joinedRoom(room: Room) {
    s.roomId = room.id;
  },
  leftRoom() {
    s.roomId = undefined;
  },
  connected(client: Client) {
    s.socketId = client.socketId;
  },
  disconnected() {
    s.socketId = undefined;
  },
};
