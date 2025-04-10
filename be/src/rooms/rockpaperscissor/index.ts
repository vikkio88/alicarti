import { stateUpdate, type ActionPayload, type Client } from "@alicarti/shared";
import type {
  Choose,
  Move,
  Phase,
  RPSActions,
  RPSGameState,
} from "@alicarti/shared/rooms/rockpaperscissor/config";
import type { StatefulRoom } from "../StatefulRoom";
import type { ServerWebSocket } from "bun";
import type { ServerContext } from "../../servers/websocket";
import type { TopicConfig } from "../../libs/Topic";
import { createTextChangeRange } from "typescript";

const initialState = (playerOne: string) => ({
  phase: "waiting" as Phase,
  playersMap: {
    one: playerOne,
    two: undefined,
  },
  score: {
    one: 0,
    two: 0,
  },
  hasChosen: {
    one: false,
    two: false,
  },
});

export type RPSRoomConfig = {
  adminId: string;
};
export class RPSRoom implements StatefulRoom<RPSGameState> {
  state: RPSGameState;
  topicName: string;
  hasSetup: boolean = true;

  currentTurn: { one?: Move; two?: Move } = { one: undefined, two: undefined };

  constructor(topicName: string) {
    this.state = initialState("");
    this.topicName = topicName;
  }

  setup(config: unknown) {
    this.state.playersMap.one = (config as TopicConfig).admin;
  }

  onJoin(client: Client, ctx: ServerContext): void {
    this.state.playersMap.two = client.socketId;
    this.state.phase = "ready";
    ctx.server?.publish(this.topicName, stateUpdate(this.state));
  }

  onLeave(): void {
    //TODO: handle this
  }

  dispatch<TAction>(
    action: ActionPayload<TAction>,
    ws: ServerWebSocket<Client>,
    ctx: ServerContext
  ): RPSGameState {
    console.log("action", action);
    switch (action.action as RPSActions) {
      case "start": {
        this.state.phase = "choosing";
        break;
      }
      case "choose": {
        const { move } = action.data as Choose;
        const client = ws.data.socketId;
        const player = this.state.playersMap.one === client ? "one" : "two";
        this.state.hasChosen[player] = true;
        this.currentTurn[player] = move;
        break;
      }
      default: {
        ctx.logger(`wrong action type ${action.action}`);
      }
    }
    return this.state;
  }
}
