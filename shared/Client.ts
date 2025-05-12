import type { CommandInfo } from "./commands";
import type { RoomType } from "./rooms";

export type Client = {
  socketId: string;
  name?: string;
  createdAt: number;
  availableCommands: CommandInfo[];
  availableRooms: RoomType[];
};

export type ClientDTO = {
  socketId: string;
  name?: string;
  createdAt: number;
};

export function dto(client: Client): ClientDTO {
  const { socketId, name, createdAt } = client;
  return {
    socketId,
    name,
    createdAt,
  };
}
