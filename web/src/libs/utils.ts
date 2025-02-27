import { Commands, type Client } from "@alicarti/shared";

export function canCreateRoom(clientInfo?: Client | null) {
  if (!clientInfo) return false;

  return clientInfo.availableCommands
    .map((c) => c.name)
    .includes(Commands.CREATE_ROOM);
}
