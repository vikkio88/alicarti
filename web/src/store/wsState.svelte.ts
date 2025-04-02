import type { Client } from "@alicarti/shared";
import type { Room } from "@alicarti/shared/rooms";
import { connection } from "../libs/ws";

type WsState = {
  roomId?: string;
  socketId?: string;
  clientName?: string;
};

let s: WsState = $state({
  roomId: undefined,
  socketId: undefined,
  clientName: undefined,
});

export const ws = {
  get roomId() {
    return s.roomId;
  },
  get socketId() {
    return s.socketId;
  },
  get displayName() {
    return s.clientName || s.socketId;
  },
  get isConnected() {
    return Boolean(ws.socketId);
  },
  connect() {
    connection.open(() => this.connected(connection.info().connection!));
    connection.onClose(() => ws.disconnected());
  },
  disconnect() {
    this.disconnected();
    connection.close();
  },

  /** Post Event */
  joinRoom(room: Room) {
    s.roomId = room.id;
  },
  leaveRoom() {
    s.roomId = undefined;
  },
  connected(client: Client) {
    s.socketId = client.socketId;
    s.clientName = client.name;
  },
  disconnected() {
    s.roomId = undefined;
    s.socketId = undefined;
    s.clientName = undefined;
  },
};
