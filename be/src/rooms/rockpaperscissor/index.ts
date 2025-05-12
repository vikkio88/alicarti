import {
  dto,
  stateUpdate,
  type ActionPayload,
  type Client,
} from "@alicarti/shared";
import {
  type AssignedRole,
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
import { calculateResult } from "./logic";
import { choose, end, restart, reveal, start } from "./stateTransitions";

const initialState = (playerOne: string): RPSGameState => ({
  phase: "waiting" as Phase,
  clients: [],
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

export type CurrentTurn = { one?: Move; two?: Move };
export class RPSRoom implements StatefulRoom<RPSGameState> {
  state: RPSGameState;
  topicName: string;
  hasSetup: boolean = true;

  currentTurn: CurrentTurn = { one: undefined, two: undefined };

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
    this.state.clients.push(dto(client));

    if (this.state.playersMap.two) {
      ctx.logger(`${client.socketId} joined as spectator`);
      return;
    }

    this.state.playersMap.two = client.socketId;
    this.state.reversePlayersMap[client.socketId] = "two";
    this.state.phase = "ready";
    ctx.server?.publish(this.topicName, stateUpdate(this.state));
  }

  onLeave(client: Client, ctx: ServerContext): void {
    const leaverId = client.socketId;
    const leavingPlayer = this.state.reversePlayersMap[leaverId];
    if (!this.state.playersMap[leavingPlayer]) {
      ctx.logger(`${leaverId} left the RPS room, but was not a player`);
      return;
    }

    const remainingPlayerId = (
      leavingPlayer === "two"
        ? this.state.playersMap.one
        : this.state.playersMap.two
    )!;
    this.state = initialState(remainingPlayerId);
    this.state.reversePlayersMap[remainingPlayerId] = "one";
    ctx.server?.publish(this.topicName, stateUpdate(this.state));
  }

  dispatch<TAction>(
    action: ActionPayload<TAction>,
    ws: ServerWebSocket<Client>,
    ctx: ServerContext
  ): RPSGameState {
    switch (action.action as RPSActions) {
      case "start": {
        this.state = start(this.state);
        break;
      }
      case "restart": {
        this.state = restart(this.state);
        break;
      }
      case "end": {
        this.state = end(this.state);
        break;
      }
      case "choose": {
        const client = ws.data.socketId;
        const [newState, newCurrentTurn] = choose(
          this.state,
          this.currentTurn,
          client,
          action.data as Choose
        );
        this.state = newState;
        this.currentTurn = newCurrentTurn;
        break;
      }
      case "reveal": {
        const [newState, newCurrentTurn] = reveal(
          this.state,
          this.currentTurn,
        );
        this.state = newState;
        this.currentTurn = newCurrentTurn;
      
        break;
      }
      case "assignRole": {
        const assignment = action.data as AssignedRole;
        console.log(assignment);

        break;
      }
      default: {
        ctx.logger(`wrong action type ${action.action}`);
      }
    }
    return this.state;
  }
}
