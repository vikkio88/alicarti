import type { CommandInfo } from "./commands";
import type { RoomType } from "./rooms";

export type Client = {
  socketId: string;
  name?: string;
  createdAt: number;
  availableCommands: CommandInfo[];
  availableRooms: RoomType[];
};
