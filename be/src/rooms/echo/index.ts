import type { ActionPayload, Client } from "@alicarti/shared";
import type {
  EchoRoomState,
  ShoutPayload,
} from "@alicarti/shared/rooms/echo/config";

export function actionsHandler(
  client: Client,
  currentState: EchoRoomState,
  action: ActionPayload<ShoutPayload>
): EchoRoomState {
  if (action.data?.msg) {
    const msg = `${client.socketId}: ${action.data.msg}`;
    const echo = `room: ${action.data.msg}`;
    currentState.messages = [...currentState.messages, msg, echo];
  }
  return currentState;
}
