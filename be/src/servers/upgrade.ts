import { RoomTypes, type Client } from "@alicarti/shared";
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
