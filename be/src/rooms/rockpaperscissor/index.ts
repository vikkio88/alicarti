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
import {
  choose,
  end,
  playerJoined,
  restart,
  reveal,
  setup,
  start,
  initialState,
  playerLeft,
} from "./stateTransitions";

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
    const { adminClient } = config as TopicConfig;
    this.state = setup(dto(adminClient!));
  }

  onJoin(client: Client, ctx: ServerContext): void {
    this.state = playerJoined({ ...this.state }, dto(client));

    if (!this.state.reversePlayersMap[client.socketId]) {
      ctx.logger(`${client.socketId} joined as spectator`);
    }

    ctx.server?.publish(this.topicName, stateUpdate(this.state));
  }

  onLeave(client: Client, ctx: ServerContext): void {
    if (!this.state.reversePlayersMap[client.socketId]) {
      ctx.logger(`${client.socketId} left the RPS room, but was not a player`);
      return;
    }
    this.state = playerLeft({ ...this.state }, dto(client));
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
        const [newState, newCurrentTurn] = reveal(this.state, this.currentTurn);
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
