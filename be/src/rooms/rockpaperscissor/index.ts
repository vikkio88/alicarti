import { stateUpdate, type ActionPayload, type Client } from "@alicarti/shared";
import {
  type Choose,
  type Move,
  type Phase,
  type RPSActions,
  type RPSGameState,
} from "@alicarti/shared/rooms/rockpaperscissor/config";
import type { StatefulRoom } from "../StatefulRoom";
import type { ServerWebSocket } from "bun";
import type { ServerContext } from "../../servers/websocket";
import type { TopicConfig } from "../../libs/Topic";

const initialState = (playerOne: string): RPSGameState => ({
  phase: "waiting" as Phase,
  playersMap: {
    one: playerOne,
    two: undefined,
  },
  reversePlayersMap: {},
  score: {
    one: 0,
    two: 0,
    draws: 0,
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
    const adminId = (config as TopicConfig).admin!;
    this.state.playersMap.one = adminId;
    this.state.reversePlayersMap[adminId] = "one";
  }

  onJoin(client: Client, ctx: ServerContext): void {
    this.state.playersMap.two = client.socketId;
    this.state.reversePlayersMap[client.socketId] = "two";
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
      case "reveal": {
        const result = calculateResult(this.currentTurn);
        if (!result.draw) {
          this.state.score[result.winner] += 1;
        } else {
          this.state.score.draws += 1;
        }

        this.state.result = result;
        this.state.phase = "display";
        this.currentTurn = { one: undefined, two: undefined };
        this.state.hasChosen = { one: false, two: false };
        break;
      }
      default: {
        ctx.logger(`wrong action type ${action.action}`);
      }
    }
    return this.state;
  }
}

const movesMatrix: Record<Move, Record<Move, -1 | 0 | 1>> = {
  rock: { rock: 0, paper: -1, scissor: 1 },
  paper: { rock: 1, paper: 0, scissor: -1 },
  scissor: { rock: -1, paper: 1, scissor: 0 },
};

function calculateResult(currentTurn: { one?: Move; two?: Move }): {
  winner: "one" | "two";
  draw: boolean;
} {
  if (!currentTurn.one || !currentTurn.two) {
    return { winner: "one", draw: true };
  }

  const draw = movesMatrix[currentTurn.one][currentTurn.two] === 0;
  const winnerOne = movesMatrix[currentTurn.one][currentTurn.two] === 1;
  return { winner: winnerOne ? "one" : "two", draw };
}
