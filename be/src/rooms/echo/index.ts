import type { ActionPayload, Client } from "@alicarti/shared";
import type {
  EchoRoomState,
  ShoutPayload,
} from "@alicarti/shared/rooms/echo/config";
import type { StatefulRoom } from "../interfaces";
import type { ServerWebSocket } from "bun";
import type { ServerContext } from "../../libs/messageHandler";

export function actionsHandler(
  client: Client,
  currentState: EchoRoomState,
  action: ActionPayload<ShoutPayload>
): EchoRoomState {
  if (action.data?.message) {
    const msg = `${client.socketId}: ${action.data.message}`;
    const echo = `room: ${action.data.message}`;
    currentState.messages = [...currentState.messages, msg, echo];
  }
  return currentState;
}

const initialState: EchoRoomState = {
  messages: [],
};

export class EchoRoom implements StatefulRoom<EchoRoomState> {
  state: EchoRoomState;
  constructor() {
    this.state = initialState;
  }
  dispatch<TAction>(
    action: ActionPayload<TAction>,
    ws: ServerWebSocket<Client>,
    ctx: ServerContext
  ): EchoRoomState {
    switch (action.action) {
      case "shout": {
        const data = action.data as ShoutPayload;
        this.state.messages.push(`server: ${data.message}`);
        break;
      }
      default: {
        ctx.logger(`wrong action type ${action.action}`);
      }
    }
    return this.state;
  }
}
