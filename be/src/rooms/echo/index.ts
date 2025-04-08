import type { ActionPayload, Client } from "@alicarti/shared";
import type {
  EchoRoomActions,
  EchoRoomState,
  ShoutPayload,
} from "@alicarti/shared/rooms/echo/config";
import type { StatefulRoom } from "../StatefulRoom";
import type { ServerWebSocket } from "bun";
import type { ServerContext } from "../../servers/websocket";

const initialState = () => ({
  messages: [],
});
export class EchoRoom implements StatefulRoom<EchoRoomState> {
  state: EchoRoomState;
  hasSetup: boolean = false;
  constructor() {
    this.state = { ...initialState() };
  }
  setup(): void {}
  dispatch<TAction>(
    action: ActionPayload<TAction>,
    ws: ServerWebSocket<Client>,
    ctx: ServerContext
  ): EchoRoomState {
    switch (action.action as EchoRoomActions) {
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
