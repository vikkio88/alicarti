import type { CommandInfo } from "./commands";

export type Client = {
  socketId: string;
  name?: string;
  createdAt: number;
  availableCommands: CommandInfo[];
};
