import type { ActionPayload, Client } from "@alicarti/shared";
import type {
  Phase,
  RPSGameState,
} from "@alicarti/shared/rooms/rockpaperscissor/config";
import type { StatefulRoom } from "../StatefulRoom";
import type { ServerWebSocket } from "bun";
import type { ServerContext } from "../../servers/websocket";
import type { TopicInit } from "../../libs/Topic";

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
  constructor() {
    this.state = initialState("");
  }
  hasSetup: boolean = true;

  setup(config: unknown) {
    this.state.playersMap.one = (config as TopicInit).admin;
  }

  dispatch<TAction>(
    action: ActionPayload<TAction>,
    ws: ServerWebSocket<Client>,
    ctx: ServerContext
  ): RPSGameState {
    return this.state;
  }
}
