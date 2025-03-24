import { type Client } from "@alicarti/shared";
import { RoomTypes } from "@alicarti/shared/rooms";
import { ClientsManager } from "../libs/ClientsManager";
import { availableCommands } from "../libs/messageHandler";

const availableRooms = [RoomTypes.echo];

export function websocketUpgrade(): { data: Client } {
  const client = ClientsManager.newClient(availableRooms, availableCommands);
  return {
    data: {
      ...client,
    },
  };
}
