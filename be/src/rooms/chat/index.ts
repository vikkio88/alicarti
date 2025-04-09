import type { ActionPayload, Client } from "@alicarti/shared";
import type {
  ChatRoomActions,
  ChatRoomState,
  SendMessagePayload,
} from "@alicarti/shared/rooms/chat/config";

import type { StatefulRoom } from "../StatefulRoom";
import type { ServerWebSocket } from "bun";
import type { ServerContext } from "../../servers/websocket";

const initialState = () => ({
  messages: [],
});

export class ChatRoom implements StatefulRoom<ChatRoomState> {
  state: ChatRoomState;
  topicName: string;
  hasSetup: boolean = false;

  constructor(topicName: string) {
    this.topicName = topicName;
    this.state = { ...initialState() };
  }
  setup(): void {}
  onJoin(client: Client): void {}
  onLeave(client: Client): void {}

  dispatch<TAction>(
    action: ActionPayload<TAction>,
    ws: ServerWebSocket<Client>,
    ctx: ServerContext
  ): ChatRoomState {
    switch (action.action as ChatRoomActions) {
      case "send_message": {
        const data = action.data as SendMessagePayload;
        const client = ws.data.socketId;
        this.state.messages.push({
          message: data.message,
          author: { id: client, name: ws.data.name },
          timestamp: Date.now(),
        });
        break;
      }
      default: {
        ctx.logger(`wrong action type ${action.action}`);
      }
    }
    return this.state;
  }
}
